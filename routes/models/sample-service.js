const sampleService = {};


const sampleAccess = require('./sample-access.js');
const mysqlConn = require('../utilities/mysql-conn.js');
const loggerHandler = require('../utilities/logger-handler.js');

let logger = loggerHandler.logger;


sampleService.getSample = async(data)=>{
  let err, result
  // Do some business logics....
  [err ,result] = await sampleAccess.getsampleAccess(data);
  if(result){
    return {success:true, data:result};
  }else{
    if(err !== 'error'){
      logger.error(err.stack?err.stack:err);
    }
    return {success:false, msg:'internal error'};
  }

}



sampleService.updateSample = async(data)=>{
  let err, result, conn;
  try{

    // Do some business logics....

    
    [err, conn] = await mysqlConn.sampledb.getConnWithTx();
    if(err){
      throw err;
    }
    [err, result] = await sampleAccess.deleteSample(data,conn);
    if(err){
      throw err;
    }
    [err, result] = await sampleAccess.insertSample(data,conn);
    if(err){
      throw err;
    }
    [err, result] = await mysqlConn.sampledb.commitWithTx(conn);
    
    if(err){
      throw err;
    }else{
      return {success:true, data:''};
    }

  }catch(err){
    if(conn){
      mysqlConn.sampledb.rollbackWithTx(conn);
    }
    if(err !== 'error'){
      logger.error(err.stack?err.stack:err);
    }
    return {success:false, msg:'internal error'};
  }
};

module.exports = sampleService;
