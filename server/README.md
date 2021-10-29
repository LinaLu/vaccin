# Build and Run

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Create the database schema
https://flask-sqlalchemy.palletsprojects.com/en/2.x/quickstart/

# Test resource

curl http://127.0.0.1:5000/api/vaccine/report