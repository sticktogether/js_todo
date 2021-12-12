const { Router } = require('express');
const ErrorResponse = require('../classes/error-response');
const User = require('../dataBase/models/User.model');
const Token = require('../dataBase/models/Token.model')
const { asyncHandler } = require('../middlewares/middlewares');
const { nanoid } = require('nanoid')

const router = Router();

function initRoutes() {
    router.post('/registration', asyncHandler(createUser));
    router.post('/login', asyncHandler(loginUser));
}

async function createUser(req, res) {
    const { login, password, email, name } = req.body
    if (!login || !password) {
        throw new ErrorResponse('Wrong email or password', 400);
    }
    const candidate = await User.findOne({ where: { email } })

    if (candidate) {
        throw new ErrorResponse('This email already in use', 400);
    }

    //Создание пользователя
    const user = await User.create({ login, password, email, name })
    console.log(user)

    res.status(200).json({ message: 'ok' });
}

async function loginUser(req, res, next) {
    const { login, password } = req.body

    //Отправлен ли пароль и логин
    if (!password || !login) {
        throw new ErrorResponse('Credentials not send', 400);
    }
    const user = await User.findOne({ where: { login } })

    //Пользователь не найден
    if (!user) {
        throw new ErrorResponse('No user by login', 400);
    }

    //Проверка пароля
    if (password != user.password) {
        throw new ErrorResponse('Wrong password', 400);
    }

    //Создание токена
    const value = nanoid()

    const token = await Token.create({ userId: user.id, value })

    res.status(200).json({ "token": token.value });
}


initRoutes();

module.exports = router;