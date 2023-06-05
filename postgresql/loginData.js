
const connection = require('./connection');
const session = require('../session/sessionProcess.js');

exports.selectUser = function(request,response){ 

     //let query = ' SELECT * FROM project.board '; 
  console.log(request.query);
  let paramArr = [request.query.id,request.query.password];
  let query =  'SELECT * FROM public.tb_user_master ';
      query += ' where user_id = $1  and user_password = $2 ';
  connection.query(query,paramArr, function (error, results, fields) {
    
    if (error) throw error;
    //bcrypt
    console.log('사용자 인증 완료');

    if(results.rowCount > 0){
      session.loginSession(request,response);
      response.send('success');
    }else response.send('fail');
    

    }); 
  
  }