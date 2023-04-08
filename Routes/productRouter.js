const router = require("express").Router()
const productsController = require("../Controllers/productController")


router.route('/products')
    .get(productsController.getProducts)
    .post(productsController.createProduct)


router.route('/products/:id')
    .delete(productsController.deleteProduct)
    .put(productsController.updateProduct)


module.exports = router