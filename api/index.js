const Router = require('@koa/router');
const { prefix } = require('@root/config')
const userRouter = require('./user');

const router = new Router({
    prefix,
})

router.use(userRouter.routes());

module.exports = router;