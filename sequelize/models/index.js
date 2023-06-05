require("dotenv").config();

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.POSTGRESQL_SID, process.env.POSTGRESQL_USER, process.env.POSTGRESQL_PASSWORD, {
	host: process.env.POSTGRESQL_HOST,
  	dialect: process.env.POSTGRESQL_SID,
  	//operatorsAliases: false,
	  operatorsAliases: 0,
  
  	pool: {
    	max: 5,
  		min: 0,
  		acquire: 30000,
  		idle: 10000
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Master = require("./tb_user_master.js")(sequelize, Sequelize);
//db.Friend = require("./tb_user_friend.js")(sequelize, Sequelize).removeAttribute('id');;
db.Friend = require("./tb_user_friend.js")(sequelize, Sequelize);
db.Chat010 = require("./tb_chat_010.js")(sequelize, Sequelize);
db.Chat020 = require("./tb_chat_020.js")(sequelize, Sequelize);


module.exports = db;