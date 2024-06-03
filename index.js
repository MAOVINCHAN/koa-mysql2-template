const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

require('module-alias/register'); // User-defined import must after this line.
require('@core/init').init();
const router = require('@root/api');
const { port } = require('@root/config');
const catchError = require('@middlewares/catchError');
const defineLang = require('@middlewares/defineLang');
const logRecorder = require('@middlewares/logRecorder');

const app = new Koa();

app.use(cors());
app.use(bodyParser());

app.use(logRecorder);
app.use(catchError);
app.use(defineLang);
app.use(router.routes()).use(router.allowedMethods());

app.listen(port);