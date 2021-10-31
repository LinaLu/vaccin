import csv
from datetime import datetime
from functools import wraps
from io import StringIO

import pandas as pd
from flask import Flask, request, jsonify
from flask_restx import Api, Resource, abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.ext.mutable import MutableDict

app = Flask(__name__)
api = Api(app, version='1.0', title='Vaccine API', description='A Vaccine Coordination API')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(app)


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    def as_dict(self):
        return {'id': self.id, 'name': self.name, 'is_admin': self.is_admin}

    def __repr__(self):
        return '<Account %r>' % self.name


class VaccinationSupplyData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)  # timezone?
    type = db.Column(db.String(80), nullable=False)
    data = db.Column(MutableDict.as_mutable(JSON))

    def __repr__(self):
        return '<VaccinationSupplyData %r>' % self.type


def secure(f):
    @wraps(f)
    def check_authorization(*args, **kwargs):
        account_id = request.headers.get("ACCOUNT_ID")
        account = Account.query.get(account_id)
        if account:
            return f(*args, account=account, **kwargs)
        else:
            return abort(403)

    return check_authorization


@app.route('/api/user/login', methods=['POST'])
def login():
    name = request.json['name']
    user = Account.query.filter_by(name=name).first()
    return jsonify(user.as_dict()), 200


@app.route('/api/user/register', methods=['POST'])
def register():
    name = request.json['name']

    user = Account(name=name, is_admin="admin" in name)
    db.session.add(user)
    db.session.commit()
    return jsonify({}), 200


@api.route('/api/vaccine/report')
class VaccinationReport(Resource):

    def get(self):
        rows = db.session.query(Account.name,
                                VaccinationSupplyData.type,
                                VaccinationSupplyData.created_date,
                                VaccinationSupplyData.data,
                                ).join(VaccinationSupplyData).all()
        reported = [{"account": row.name,
                     "date": row.created_date.strftime("%Y-%m-%d"),
                     "type": row.type,
                     **row.data} for row in rows]
        accounts = [account.name for account in Account.query.all()]

        if reported:
            df_reported = pd.DataFrame(reported)
            report = df_reported.groupby(["account", "type", "date"]).size().reset_index(name='count').to_dict(orient='records')
            accounts_not_in_report = (set(accounts).difference(set([row["account"] for row in report])))
            return report + [{"account": account, "count": 0} for account in accounts_not_in_report]
        else:
            return []


@api.route('/api/vaccine/supply/<string:type>', '/api/vaccine/supply/<string:type>/<int:id>')
class VaccinationDelivery(Resource):

    @secure
    def get(self, account, type):
        filter = {"type": type} if account.is_admin else {"type": type, "account_id": account.id}
        rows = db.session.query(Account.name,
                                VaccinationSupplyData.id,
                                VaccinationSupplyData.data).join(VaccinationSupplyData).filter_by(**filter).all()

        return [{"id": row.id, "account": row.name, **row.data} for row in rows]

    @secure
    def delete(self, account, type, id):
        row = VaccinationSupplyData.query.get(id)
        if row and row.type == type:
            db.session.delete(row)
            db.session.commit()

    @secure
    def post(self, account, type):
        supply_data = VaccinationSupplyData(type=type, account_id=account.id, data=request.json)
        db.session.add(supply_data)
        db.session.commit()
        rows = VaccinationSupplyData.query.filter_by(type=type).all()
        return [{"id": row.id, **row.data} for row in rows]


if __name__ == '__main__':
    app.run(debug=True)
