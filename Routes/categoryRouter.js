const router = require('express').Router()
const categoryController = require('../Controllers/categoryController')
const auth = require('../Middlewares/auth')
const authAdmin = require('../Middlewares/authAdmin')

router.route('/category')
    .get(categoryController.getCategory)
    .post(auth, authAdmin, categoryController.createCategory)

router.route('/category/:id')
    .delete(auth, authAdmin, categoryController.deleteCategory)
    .put(auth, authAdmin, categoryController.updateCategory)


module.exports = router