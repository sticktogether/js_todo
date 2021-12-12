const { Router } = require("express");
const ErrorResponse = require('../classes/error-response');
const Token = require("../dataBase/models/Token.model");
const User = require("../dataBase/models/User.model");
const { asyncHandler, requireToken } = require('../middlewares/middlewares');

const router = Router();

function initRoutes() {
    router.get('/me', asyncHandler(requireToken), asyncHandler(getUser));
    router.patch('/me', asyncHandler(requireToken), asyncHandler(updateUser));
    router.post('/logout', asyncHandler(requireToken), asyncHandler(logout));
}

async function getUser(req, res) {
    const userId = req.userId
    
    //Поиск пользователя по id
    const user = await User.findByPk(userId)
    res.status(200).json({user: user});
}

async function updateUser(req, res) {
    const userId = req.userId
    const {name, login} = req.body

    //Обновление имени и логина пользователя
    const user = await User.update({
        name, login
    }, {
        where: {
            id: userId
        }
    })
    if (!user) {
        throw new ErrorResponse('User not found', 404);
    }
    res.status(200).json({message: "ok"});
}


async function logout(req, res) {
    
    //Удаление токена из бд
    await Token.destroy(
        {
            where: {
              value: req.header("x-access-token"),
            },
          }
    )

    res.status(200).json({message: "ok"});
}


initRoutes();

module.exports = router;