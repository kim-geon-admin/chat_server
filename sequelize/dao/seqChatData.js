const {Chat010,Chat020,Sequelize,sequelize} = require('../models');

const { QueryTypes } = require('sequelize');

const logger = require('../../logger');

const redisClient = require('../../redis/redisConnection');

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
  result.room_id = result.id; //id로 자동발번된것을 room_id값으로 복사한다
  await result.save(); // 위에서 복사한값을 커밋
  
        if(result.dataValues.room_id != null){
          console.log('대화방 생성이 정상적으로 되었습니다',result.dataValues.room_id);
          
       

          /**
           *    chat020에도 대화방을 생성할 필요가 있는지 확인하고 
           *    없으면 생성
           * 
           */
          try{
            await selectChatDetailRoom({room_id:result.dataValues.room_id});
          }catch(e){
            console.log(e);
          }
                  
          
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
 const selectChatDetailRoom =async   function(msgObj){ 
  logger.info(` seqChatData.js 파일 내 fn_selectChatDetailRoom 수행 `);
  await Chat020.findOne({where:{
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


/**
     * redis에 msg히스토를 남겨둔다  
     *
     */

exports.setMsgtoRedis = async function(msgObj){ 
 // console.log('여기 탄다',msgObj); 
  logger.info(` seqChatData.js 파일 내 setMsgtoRedis 수행 `);

//1. redis 존재여부 확인
//2-1 없다면 const a = [msgObj]  
  //2-2 있다면 get 해와서 JSON.parse 한다음에 배열 끝에 push해주고 .. 다시 stringify 로 만들어 준뒤 셋 

  try{
    const redisMsg = await redisClient.get(`room_${msgObj.room_id}`);
   

    if(redisMsg != null ){
     
       let redisMsgArr = JSON.parse(redisMsg);
       redisMsgArr.push(msgObj);
       //console.log(redisMsgArr);
       let msgString = JSON.stringify(redisMsgArr);
       await redisClient.set(`room_${msgObj.room_id}`,msgString); 
       if(msgString.length >100){
        logger.info(` DB에 Redis 메세지를 저장합니다 `);
          let msgSet = {
              msg : msgString,
              fullLength : msgString.length,
              room_id : msgObj.room_id,
          }
          
          this.selectChat010(msgSet);
       }

    }else{
      logger.info(` 등록된 redis Msg 없음 `);
      await redisClient.set(`room_${msgObj.room_id}`,JSON.stringify([msgObj]));
    }
   
   
   // console.log('여기 탄다2222',redisMsg); 
  }catch(error){
    logger.error(error);
  }
  //wait redisClient.set('dddddd',msgObj.message);
  
  // client.lpush('list','a');    //키 list에 a가 들어갑니다.
  // client.lpush('list','b');    //키 list에 b가 들어갑니다.
  // client.lpush('list','c');    //키 list에 c가 들어갑니다.
  // client.lpush('list','d');    //키 list에 d가 들어갑니다.
   
  // client.lrem('list',1,b);     //키 list에 b가 있다면 하나만 지웁니다.
  // client.lrange('list',0,-1);  //키 list를 모두 출력합니다. a, c, d 가 나옵니다.
  // client.lrange('list',1,2);   //키 list의 index기준 1~2를 출력합니다. c, d 가 나옵니다.
  // client.llen('list');         //키 list의 길이를 출력합니다. 3 이 나옵니다.


}      



exports.selectChat010 =  function(msgSet){ 
  logger.info(` seqChatData.js 파일 내 fn_selectChat010 수행 `);
   Chat010.findOne({where:{
        room_id:msgSet.room_id
      },
      raw:true,
      plain:true
      })
    .then((result) => {
   
    
        if(result != null ){
        
           if(result.contents != null && result.contents.length > 0){
            let dbMsgArr = JSON.parse(result.contents);
       //     console.log('저장할 것!!!!',dbMsgArr);
      //      console.log('저장할 것!!!!22222',msgSet.msg);
            const newMsgArr = dbMsgArr.concat(JSON.parse(msgSet.msg));
  

            let saveMsgObj = {
                contentsLength : newMsgArr.length,
                contents : JSON.stringify(newMsgArr),
                roomId : msgSet.room_id,
                id : msgSet.id,
                exit : msgSet.exit
            }
             this.saveMsgChat(saveMsgObj);
            
           }else{
            let dbMsgArr = [];
            const newMsgArr =dbMsgArr.concat(JSON.parse(msgSet.msg));
              let saveMsgObj = {
                  contentsLength : newMsgArr.length,
                  contents : msgSet.msg,
                  roomId : msgSet.room_id,
                  id : msgSet.id,
                  exit : msgSet.exit
              }  
             this.saveMsgChat(saveMsgObj);

           }
         
        
          
        }else  logger.error('db메세지 chat010 데이터가 없습니다');
        

     }).catch((error)=>{logger.error(error)});

}



/**
     * msg를 db에 저장한다
     *
     */

exports.saveMsgChat =  async function(msgObj){ 
  logger.info(` seqChatData.js 파일 내 fn_saveMsgChat 수행 `);
    await this.saveMsgChat010(msgObj);
    if(msgObj.exit){ 
      logger.info('★★★★★종료처리★★★★');
      await this.saveMsgChat020(msgObj);
    }
    await redisClient.del(`room_${msgObj.roomId}`);
}

exports.saveMsgChat010 =  function(msgObj){ 
  
  logger.info(` seqChatData.js 파일 내 fn_saveMsgChat010 수행 `);
  console.log(msgObj);
  return   Chat010.update(
    //update할 칼럼 정보
    {
     contents:msgObj.contents,
     contents_length:msgObj.contentsLength
    },
    //where절 
    {
     where : { room_id : msgObj.roomId}
    }).then(()=>{
      logger.info(` 정상적으로 chat010 저장되었습니다 `);
      return true;
      
      
    }).catch((error)=> logger.error(error));


}      


exports.saveMsgChat020 =  function(msgObj){ 
  
  logger.info(` seqChatData.js 파일 내 fn_saveMsgChat020 수행 `);
  console.log(msgObj);
  return Chat020.update(
    //update할 칼럼 정보
    {
     contents:msgObj.contents,
     contents_length:msgObj.contentsLength
    },
    //where절 
    {
     where : { room_id : msgObj.roomId,
               user_id : msgObj.id
             }
    }).then(()=>{
      logger.info(` 정상적으로 chat020 저장되었습니다 `);
     return true
    }).catch((error)=> logger.error(error));

}