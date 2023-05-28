
const PostgreClient = require('pg');
require("dotenv").config();

const connection = new PostgreClient.Pool({
    user: process.env.POSTGRESQL_USER,
    host: process.env.POSTGRESQL_HOST,
   //host: "host.docker.internal",
    database: process.env.POSTGRESQL_SID ,
    password: process.env.POSTGRESQL_PASSWORD ,
    port: process.env.POSTGRESQL_PORT 
});
 
connection.connect(err => {
if(err) console.log(err);
else console.log('DB연결 성공');
});

module.exports = connection;