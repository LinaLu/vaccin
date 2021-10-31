# Description

A POC application for gathering vaccination supply data to 
help out the _vaccination coordinator_ to get an overview regarding the vaccination demand and supply amongst healthcare units.

# Requirements

- Python 3.6+
- Node 14+
- Yarn

# Backend

Backend is runing by default on the localhost port 5000. 
Swagger UI in can be found from the root path (http://127.0.0.1:5000/)

## Database
sqlite3, database is saved to a system _temp_ directory.

```
.venv ❯ sqlite3 /tmp/test.db
SQLite version 3.36.0 2021-06-18 18:36:39
Enter ".help" for usage hints.
sqlite> .tables
account                  vaccination_supply_data
sqlite> .quit
```
## Build and Run

```
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main
```

## Create the database schema

- make sure you python virtual enviroment is active

```
> python
from main import db
db.create_all()
exit()
```

# Frontend

Frontend by default is running in port 3000, all the front-end requests
with /api/ prefix are proxied to backend port 5000.

### Build and Run

```
cd client
yarn
yarn start
```
