const mysqlConn = {};

const mysql = require('mysql');

const config = require('../config/config.js');

const loggerHandler = require('./logger-handler.js');

let logger = loggerHandler.logger;

mysqlConn.sampledb = {};
mysqlConn.sampledb.pool = mysql.createPool({
  connectionLimit: config.mysql.sampledb.connectionLimit,
  host: config.mysql.sampledb.host,
  user: config.mysql.sampledb.username,
  password: config.mysql.sampledb.password,
  database: config.mysql.sampledb.database,
  waitForConnections: config.mysql.sampledb.waitForConnections,
  queueLimit: config.mysql.sampledb.queueLimit,
  dateStrings: true
});

mysqlConn.sampledb.query = (sql, values)=>{
  return new Promise((resolve, reject) => {
    mysqlConn.sampledb.pool.query(sql, values, (err, results, fields)=> {
      if (err) {
        logger.error(err.stack?err.stack:err);
        reject('error');
      } else {
        resolve(results);
      }
    });
  }).then((result)=>{
    return [null, result];
  }).catch((err)=>{
    if(err !== 'error'){
      logger.error(err.stack?err.stack:err);
    }
    return ['error', null];
  });
};

mysqlConn.sampledb.getConnWithTx = function(){
  return new Promise(function(resolve,reject){
    mysqlConn.sampledb.pool.getConnection(function(err, connection) {
      connection.beginTransaction(function(err) {
        if (err) {                  //Transaction Error (Rollback and release connection)
          connection.rollback(function() {
            connection.release();
            //Failure
            logger.error(err.stack?err.stack:err);
            reject('error');
          });
        } else {
          return resolve(connection);
        }
      });
    });
  }).then(function(result){
    return [null, result];
  }).catch(function(err){
    if(err !== 'error'){
      logger.error(err.stack?err.stack:err);
    }
    return ['error', null];
  });
};

mysqlConn.sampledb.queryWithTx = (conn, sql, values)=>{
  return new Promise(function(resolve, reject){
    conn.query(sql, values, function(err, results) {
      if (err) {          //Query Error (Rollback and release connection)
        conn.rollback(function() {
          conn.release();
          //Failure
          logger.error(err.stack?err.stack:err);
          reject('error');
          });
      } else {
        return resolve();
      }
    });
  }).then(function(result){
    return [null, result];
  }).catch(function(err){
    if(err !== 'error'){
      logger.error(err.stack?err.stack:err);
    }
    return ['error', null];
  });
};

mysqlConn.sampledb.commitWithTx = (conn)=>{
  return new Promise(function(resolve, reject){
    conn.commit(function(err) {
      if (err) {
        conn.rollback(function() {
          conn.release();
          //Failure
          logger.error(err.stack?err.stack:err);
          reject('error');
        });
      } else {
        conn.release();
        //Success
        resolve('ok');
      }
    });
  }).then(function(result){
    return [null, result];
  }).catch(function(err){
    if(err !== 'error'){
      logger.error(err.stack?err.stack:err);
    }
    return ['error', null];
  });
};

mysqlConn.sampledb.rollbackWithTx = (conn)=>{
  return new Promise(function(resolve, reject){
    conn.rollback(function() {
      conn.release();
      resolve();
    });
  });
};


module.exports = mysqlConn;