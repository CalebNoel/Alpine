const fs        = require("fs");
const path      = require("path");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const dotenv = require('dotenv')
const { DB_FORCE_RESTART } = process.env;


dotenv.config({ path: '../config/config.env'})

const filebasename = path.basename(__filename);
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './dev.sqlite'
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

 
var db = {}

fs
  .readdirSync(__dirname)
  .filter((file) => {
    const returnFile = (file.indexOf('.') !== 0)
      && (file !== filebasename)
      && (file.slice(-3) === '.js');
    return returnFile;
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes)
    db[model.name] = model;
  });


Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const sequelizeOptions = { logging: console.log, };

if (DB_FORCE_RESTART === 'true' && process.env.ENV !== 'production') {
  sequelizeOptions.force = true;
}

sequelize.sync(sequelizeOptions)
  .catch((err) => {
    console.log(err);
    process.exit();
  });

module.exports = db;