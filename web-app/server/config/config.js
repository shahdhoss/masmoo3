const pg = require('pg')
module.exports = {
  "development": {
    "username": "postgres",
    "password": "shahd",
    "database": "audiobook",
    "host": "localhost",
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "dialectOptions": {
      
      }
  },
  "production": {
    "username": null,
    "password": null,
    "database": null,
    "host": null,
    "dialect":null
  },
}
