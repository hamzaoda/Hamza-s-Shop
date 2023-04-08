const router = require('express').Router()
const userController = require ('../Controllers/userController')
const auth = require('../Middlewares/auth')

router.post('/register', userController.register)

router.get('/refresh_token', userController.refreshToken);

router.post('/login', userController.login)

router.post('/logout', userController.logout)

router.get('/infor', auth, userController.getUser)

router.patch('/addcart', auth, userController.addCart)

router.get('/history', auth, userController.getHistory)
module.exports = router