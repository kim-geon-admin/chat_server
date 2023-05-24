
const connection = require('./connection');

exports.selectChatRomm =  function(request,response){ 

  
 // console.log(request.query);
  let paramArr = [request.query.room_user,request.query.room_user2,request.query.room_user2,request.query.room_user];
  let query =  'SELECT * FROM public.tb_chat_010 ';
      query += ' where (room_user = $1 and room_user2 =$2) or (room_user = $3 and room_user2 = $4)  ';


    connection.query(query,paramArr, function (error, results, fields) {
    
        if (error) throw error;

        if(results.rowCount > 0){
           console.log('대화방 생성이력이 존재합니다');
            response.send(results.rows);
        }else{ 
          
            insertChatRomm(request,response);
          
        }

    }); 


  }


const insertChatRomm = function(request,response){ 

  
  //  console.log('insert param2',request.query);
   // console.log('request.query.room_user',request.query['room_user']);
    let paramArr = [request.query.room_user,request.query.room_user2];

        let query =   ' INSERT INTO public.tb_chat_010 ';
            query +=  '  ( room_user,  room_user2) ';
            query +=  ' values ( $1, $2) RETURNING * ';


      connection.query(query,paramArr, function (error, results, fields) {
      
          if (error) {
            console.log(error);
            throw error;
        }
  
          if(results.rowCount > 0){
             console.log('대화방 생성이 정상적으로 되었습니다',results.rows);
              response.send(results.rows);
          }else{ 
              response.send('fail');
          
          }
  
      }); 

    
    }
  


    exports.selectChatDetailRoom =   function(msgObj){ 
            //{ message: 'df', rommId: 'abc', id: 'master' }
  
        // console.log(request.query);
         let paramArr = [msgObj.room_id];
         let query =  ' SELECT room_id, user_id, contents, contents_length, create_time, update_time';
             query += ' FROM public.tb_chat_020 where room_id = $1 ';
  
           connection.query(query,paramArr, function (error, results, fields) {
           
               if (error) throw error;
       
               if(results.rowCount > 0){
                 // console.log('chat020 대화방이 존재합니다');
                  
               }else{ 
                   console.log('chat020 대화방 생성이력이 없어 신규 상세 대화방 생성합니다');
                  insertChatDetailRomm(msgObj.room_id);
                 
               }
       
           }); 
       
       
         }

         const insertChatDetailRomm = async function(room_id){ 

              let paramArr = [room_id];
          
              let query =   ' SELECT room_id, room_user, contents, contents_length, create_time, update_time, room_user2  ';
                  query +=  ' from public.tb_chat_010 where room_id = $1 ';

                 
            let response =  await connection.query(query,paramArr); 
       
            if(response.rowCount > 0) {
                let members = [response.rows[0].room_user,response.rows[0].room_user2];
                console.log('0000',response.rows);
                members.forEach(async function(member) {
                    console.log('11111',room_id,member);
                    let paramArr = [room_id,member];
                    let query =   ' INSERT INTO public.tb_chat_020(room_id, user_id)  ';
                        query +=  '  VALUES ($1, $2) ';
                    await connection.query(query,paramArr); 
                }); 

            }
           
              
        }


        exports.selectChatList =  function(request,response){ 


        // console.log(request.query);
            let paramArr = [request.query.id];

            let query =  ' SELECT chat010.room_id  , chat010.room_user, chat010.contents, chat010.contents_length total_length, ';
                query += ' chat020.contents_length user_length, chat010.create_time, chat010.update_time, chat010.room_user2';
                query += '   FROM public.tb_chat_010 chat010 left outer join public.tb_chat_020 chat020 on  ';
                query += '    chat010.room_id = chat020.room_id ';
                query += '   where chat020.user_id = $1 ';
                  

            connection.query(query,paramArr, function (error, results, fields) {
            
                if (error) throw error;

                if(results.rowCount > 0){
                    console.log('대화방 리스트가  존재합니다');
                    response.send(results.rows);
                }else{ 
                    
                    console.log('대화방 리스트가  없습니다');
                    
                }

            }); 


            }         