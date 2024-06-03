const Router = require('@koa/router');
const Validator = require('@utils/validator');
const { registerRules, findUserRules, findByIdRules } = require('@validators/user');
const Resovler = require('@core/resovler');
const { generateToken, resolveToken } = require('@utils/token');
const UserDAO = require('@dao/user');
const Auth = require('@middlewares/auth');
const { COOKIE_USER_INFO, AUTH_SUPER, AUTH_ADMIN, AUTH_USER } = require('@core/constants');

const router = new Router({
    prefix: '/user'
})
const resolver = new Resovler();

router.post('/register', async (ctx) => {
    const { request, response } = ctx;
    const { body } = request;
    const { valid, message } = new Validator(body, registerRules).and();
    if (!valid) {
        response.body = resolver.fail(message);
        return;
    }

    const data = await UserDAO.create(body);
    ctx.body = resolver.json(data)
})

router.post('/login', async (ctx) => {
    const { request, response, cookies } = ctx;
    const { body } = request;

    const { valid, message } = new Validator(body, findUserRules).or();

    if (!valid) {
        response.body = resolver.fail(message);
        return;
    }

    const user = await UserDAO.verify(body);
    const data = await UserDAO.details(user.id);

    const token = generateToken(user.id, user.role);
    const expiresTime = resolveToken(token)?.exp * 1000;
    const expires = new Date(expiresTime);
    cookies.set(COOKIE_USER_INFO, token, {
        httpOnly: true,
        expires,
    });

    response.status = 200;
    ctx.body = resolver.json(data);
})

router.delete('/delete/:id', new Auth(AUTH_SUPER).verify, async (ctx) => {
    const { params, response } = ctx;
    const { valid, message } = new Validator(params, findByIdRules).and();

    if (!valid) {
        response.body = resolver.fail(message);
        return;
    }

    const { id } = params;

    const res = await UserDAO.destroy(id);

    if (!res) {
        response.body = resolver.fail();
        return;
    }

    response.status = 200;
    ctx.body = resolver.success('user is deleted.');
})

router.put('/update/:id', new Auth(AUTH_ADMIN).verify, async (ctx) => {
    const { request, params, response } = ctx;
    const { body } = request;

    const { valid, message } = new Validator(params, findByIdRules).and();

    if (!valid) {
        response.body = resolver.fail(message);
        return;
    }

    const { id } = params;

    const newUser = await UserDAO.update(id, body);
    const data = await UserDAO.details(newUser.id);
    response.status = 200;
    ctx.body = resolver.json(data);
})

router.get('/info/:id', new Auth(AUTH_USER).verify, async (ctx) => {
    const { params, response } = ctx;

    const { valid, message } = new Validator(params, findByIdRules).and();

    if (!valid) {
        response.body = resolver.fail(message);
        return;
    }

    const { id } = params;

    const data = await UserDAO.details(id);

    response.status = 200;

    ctx.body = resolver.json(data);
})

router.get('/details/:id', new Auth(AUTH_ADMIN).verify, async (ctx) => {
    const { params, response } = ctx;

    const { valid, message } = new Validator(params, findByIdRules).and();

    if (!valid) {
        response.body = resolver.fail(message);
        return;
    }

    const { id } = params;

    const data = await UserDAO.details(id, 'all');

    response.status = 200;

    ctx.body = resolver.json(data);
})

router.get('/list', new Auth(AUTH_ADMIN).verify, async (ctx) => {
    const { data, total, count } = await UserDAO.list(ctx.query);

    ctx.response.status = 200;

    ctx.body = resolver.json({
        data,
        count,
        total,
    })
})

module.exports = router;