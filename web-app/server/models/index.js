'use strict';

const dotenv = require('dotenv')
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

dotenv.config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env] ||
{"username": null,
    "password": null,
    "database": null,
    "host": null,
    "dialect":null
};

const db = {};




const mongoose = require('mongoose');

const connectToMongo = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/masmoo3');
    console.log('Database Connected!');
  } catch (err) {
    console.error('Database Connection Failed:', err);
    process.exit(1);
  }
};



let sequelize;
if(env == 'production') sequelize = new Sequelize(process.env.PG_URI);
else sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.connectToMongo  = connectToMongo;

module.exports = db;
