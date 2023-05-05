
const PostgreClient = require('pg');


const connection = new PostgreClient.Pool({
    user: "postgres",
    host: "127.0.0.1",
   //host: "host.docker.internal",
    database: "postgres",
    password: "1234",
    port: 5432
});
 
connection.connect(err => {
if(err) console.log(err);
else console.log('DB연결 성공');
});

module.exports = connection;