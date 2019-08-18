const Router = require('koa-router');


const sampleService = require('./models/sample-service');
const config = require('./config/config.js');
const loggerHandler = require('./utilities/logger-handler.js');

let logger = loggerHandler.logger;



const router = Router({
  prefix: config.baseUrl
});


/** ========  GET METHOD ======== */
router.get('/sample', async(ctx)=>{
  try {
    let data = {};
    data = {
      fronttime: ctx.query.data_id
    };
    let result = await sampleService.getSample(data);
    ctx.body = result;
  }catch(err){
    if(err !== 'error'){
      logger.error(err.stack?err.stack:err);
    }
  }
});


/** ========  POST METHOD ======== */
router.post('/sample', async(ctx)=>{
  try{
    let body = ctx.request.body;
    let data = {
      data_id   :body.data_id,
      file_name :body.file_name,
      status    :body.status
    };
    let result = await sampleService.updateSample(data);
    ctx.body = result;
  }catch(err){
    if(err !== "error"){
      logger.error(err.stack);
    }
  }
});


module.exports = router;