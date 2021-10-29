from flask import Flask, request
from flask_restx import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.sqlite import JSON

from sqlalchemy.ext.mutable import MutableDict

app = Flask(__name__)
api = Api(app, version='1.0', title='TodoMVC API', description='A simple TodoMVC API')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(app)


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return '<Account %r>' % self.name


class VaccinationSupplyData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(80), nullable=False)
    data = db.Column(MutableDict.as_mutable(JSON))

    def __repr__(self):
        return '<VaccinationSupplyData %r>' % self.type


@api.route('/api/vaccine/report')
class VaccinationReport(Resource):

    def get(self):
        rows = VaccinationSupplyData.query.all()
        return [{"type": row.type, "data": row.data} for row in rows]


@api.route('/api/vaccine/supply/<string:type>')
class VaccinationDelivery(Resource):

    def post(self, type):
        supply_data = VaccinationSupplyData(type=type, data=request.json)
        db.session.add(supply_data)
        db.session.commit()
        return {}, 204


if __name__ == '__main__':
    app.run(debug=True)
