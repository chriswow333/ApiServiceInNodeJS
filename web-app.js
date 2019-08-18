
"use strict"
const Koa = require('koa');

const helmet = require("koa-helmet");
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const Router = require('koa-router');
const router = Router();
const koaSend = require('koa-send');


const config = require('./routes/config/config.js');
const sampleRouter = require('./routes/sample-router.js');

const app = new Koa();

app.use(helmet());
app.use(bodyParser());
app.use(router.routes());

app.use(sampleRouter.routes());


app.listen(config.port);

console.log('listening on port ' + config.port);

