const sampleAccess = {};


const mysqlConn = require('../utilities/mysql-conn.js');


/** ======= SELECT METHOD ========= */

/**   SELECT SAMPLE  */ 
let sampleSelectColumns = 
[
  "data_id",  "file_name"
];

sampleSelectColumns = sampleSelectColumns.join(',');

const SELECT_SAMPLE_STATEMENT = `
SELECT
  ${sampleSelectColumns}
FROM 
  Sample
WHERE 1
  AND status = 'T'
;
`;


/** ======= INSERT METHOD ========= */
/**   INSERT SAMPLE */ 
let sampleInsertColumns = 
[
  "data_id",
  "file_name",
  "status"
];

sampleInsertColumns = sampleInsertColumns.join(',');

const INSERT_SAMPLE_STATEMENT = `
INSERT INTO 
Sample
  (${sampleInsertColumns})
VALUES 
  ?
;
`;      

sampleAccess.insertSample = async(data, conn)=>{
  let params = [];
  for(let i in data){
    let subscriptionInfo = [
      data[i].data_id,
      data[i].file_name,
      data[i].status
    ];
    params.push(subscriptionInfo);
  }

  if(conn){
    return await mysqlConn.sampledb.queryWithTx(conn, sampleInsertColumns, [params]);
  }else{
    return await mysqlConn.sampledb.query(sampleInsertColumns, [params]);
  }
};  
/**   INSERT SAMPLE END */ 



/** ======= DELETE METHOD ========= */
/**   DELETE Sample by data_id */

const DELETE_SAMPLE_STATEMENT = `
DELETE FROM
  Sample
WHERE 1
  AND data_id = ?
  ;
`;       
sampleAccess.deleteSample = async(data, conn)=>{
  let params = [
    data.data_id
  ];
  if(conn){
    return await mysqlConn.sampledb.queryWithTx(conn, DELETE_SAMPLE_STATEMENT, params);
  }else{
    return await mysqlConn.sampledb.query(DELETE_SAMPLE_STATEMENT, params);
  }

}

/**   DELETE Sample by data_id END */ 

module.exports = sampleAccess;
