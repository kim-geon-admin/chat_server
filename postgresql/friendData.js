
const connection = require('./connection');

exports.selectFriend = function(request,response){ 

     //let query = ' SELECT * FROM project.board '; 
  console.log(request.query);
  let paramArr = [request.query.id];
  let query =  'SELECT * FROM public.tb_user_friend ';
      query += ' where user_id = $1  ';
  connection.query(query,paramArr, function (error, results, fields) {
    
    if (error) throw error;

    console.log('친구 목록 조회 완료');

    if(results.rowCount > 0){
      response.send(results.rows);
    }else response.send('fail');


    }); 
  
  }