const router = require('express').Router()
const paymentController = require('../Controllers/paymentController')
const auth = require('../Middlewares/auth')
const authAdmin = require('../Middlewares/authAdmin')


router.route('/payment')
    .get(auth, authAdmin, paymentController.getPayments)
    .post(auth, paymentController.createPayment)

module.exports = router