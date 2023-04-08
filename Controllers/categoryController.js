const Category = require('../Models/categoryModel')
const Products= require('../Models/productModel')

const categoryController = {
    getCategory : async (req, res) => {
        try {
            const categories = await Category.find()
            res.json(categories)
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    createCategory: async (req, res) => {
        try {
            const products = await Products.findOne({category: req.params.id})
            if(products) return res.status(400).json({msg: "Please delete all products with a relationship"})
            //if user have role = 1 ----> admin
            //only admins can create, update and delet category
            const {name} = req.body;
            const category = await Category.findOne({name})
            if (category) return res.status(400).json({msg: "This category already exists"})
            //create a new category after checking that the category isn't already exists
            const newCategory = new Category({name})
            await newCategory.save()
            res.json({msg: "a New Category has been been added", new_category: newCategory})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    deleteCategory: async (req, res) => {
        try {
            await Category.findByIdAndDelete(req.params.id)
            res.json({msg : "The category has been deleted"})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    updateCategory: async (req, res) => {
        try {
            const {name} = req.body
            await Category.findByIdAndUpdate({_id :req.params.id}, {name})
            res.json({msg : "The Category has been updated"})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }
}


module.exports = categoryController