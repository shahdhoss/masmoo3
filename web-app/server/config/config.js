const pg = require('pg')
module.exports = {
  "development": {
    "username": "postgres",
    "password": "1234",
    "database": "audiobook",
    "host": "127.0.0.1",
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
