var {Chat010,Chat020,Sequelize,sequelize} = require('../models');
const { QueryTypes } = require('sequelize');
const session = require('../../session/sessionProcess.js');
const logger = require('../../logger');

//상대방과 대화한 이력이 있는지 조회한다
exports.selectChatRomm =  function(request,response){ 

  Chat010.findAll({
        where:{
            [Sequelize.Op.or]: [
                {       
                  [Sequelize.Op.and]: [
                    {  room_user:request.query.room_user,
                      room_user2:request.query.room_user2}
          
                    ] 
                  },
                 {    
                   [Sequelize.Op.and]: [
                  {  room_user:request.query.room_user2,
                  room_user2:request.query.room_user}
      
                ] }
              ]
        },  
        raw:true
        })
      .then((result) => {
        console.log(result);
        if(result.length > 0){
            logger.info('대화방 생성이력이 존재합니다');
            response.send(result);
          }else{ 
            insertChatRoom(request,response);

          }
    
      }).catch((error)=>{logger.error(error)});
    
   
   
}


const insertChatRoom =async function(request,response){ 
  const result = await Chat010.create({ room_user: request.query.room_user,room_user2: request.query.room_user2 }, {raw:true,plain: true});
  result.room_id = result.id;
  await result.save();
  
        if(result.dataValues.room_id != null){
          console.log('대화방 생성이 정상적으로 되었습니다',result.dataValues.room_id);

          
          let rtnObj = [{
            room_id : result.dataValues.room_id,
             room_user : result.dataValues.room_user,
             room_user2 : result.dataValues.room_user2,
             room_user : result.dataValues.room_id,
             contents : result.dataValues.contents,
             contents_length : result.dataValues.contents_length,
             create_time : result.dataValues.create_time,
             update_time:  result.dataValues.update_time

          }];
          response.send(rtnObj);
      }else{ 
          response.send('fail');
      
      }
}



exports.selectChatList = async function(request,response){ 


  // console.log(request.query);
      let paramArr = [request.query.id];

      let query =  ' SELECT chat010.room_id  , chat010.room_user, chat010.contents, chat010.contents_length total_length, ';
          query += ' chat020.contents_length user_length, chat010.create_time, chat010.update_time, chat010.room_user2';
          query += '   FROM public.tb_chat_010s chat010 left outer join public.tb_chat_020s chat020 on  ';
          query += '    chat010.room_id = chat020.room_id ';
          query += '   where chat020.user_id = :user_id ';
            


          const result = await sequelize.query(
            query,
            {
              replacements: { user_id: request.query.id},
              type: QueryTypes.SELECT
            },
            {raw:true},
            {plane:true}
          );

          console.log(result);

          if(result.length > 0){
            console.log('대화방 리스트가  존재합니다');
            response.send(result);
         
         }else{ 
             response.send('fail');
         
         }

      }         

/**최초 대화시 대화방 기록이 있는지 여부 체크 */
 exports.selectChatDetailRoom =   function(msgObj){ 
  logger.info(` seqChatData.js 파일 내 fn_selectChatDetailRoom 수행 `);
  Chat020.findOne({where:{
        room_id:msgObj.room_id
      },
      raw:true,
      plain:true
      })
    .then((result) => {
      console.log(result);
    
        if(result != null ){
          logger.info(`chat020 대화방 존재함 ${result.room_id} `);
        }else{
          logger.info('chat020 대화방 생성이력이 없어 신규 상세 대화방 생성합니다');
          insertChatDetailRomm(msgObj.room_id);

        }

     }).catch((error)=>{logger.error(error)});

}


const insertChatDetailRomm = async function(room_id){ 

  let paramArr = [room_id];


  Chat010.findAll({where:{
    room_id:room_id
  },
  raw:true
  })
.then((result) => {
  console.log(result);

    if(result.length > 0){

      let members = [result[0].room_user,result[0].room_user2];
      members.forEach(async function(member) {
        const result = await Chat020.create({ room_id: room_id,user_id: member }, {raw:true,plain: true});
       
      })
    

    }

 }).catch((error)=>{logger.error(error)});




  
}