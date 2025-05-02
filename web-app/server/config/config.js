const pg = require('pg')
module.exports = {
  "development": {
    "username": "postgres",
    "password": "user",
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
}
