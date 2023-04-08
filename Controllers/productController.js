const Products = require("../Models/productModel");

//filter, sorting, pagination

class APIfeatures {
    constructor(query, queryString) {
        (this.query = query), (this.queryString = queryString);
    }
    filtring() {
        const queryObj = { ...this.queryString }; //queryString = req.query
        //exlud fields so it does not apply it to the filtring
        const excludedFields = ["page", "sort", "limit"];
        excludedFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        //applying a some operations on the filtring like greater than or regular expression
        queryStr = queryStr.replace(
            /\b(gte|gt|lt|lte|regex)\b/g,
            (match) => "$" + match
        );
        //apply the filtring on the query
        this.query.find(JSON.parse(queryStr));

        return this;
    }
    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }

    pagination() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

const productsController = {
    getProducts: async (req, res) => {
        try {
            const features = new APIfeatures(Products.find(), req.query)
                .filtring()
                .sorting()
                .pagination()
            const products = await features.query;
            res.json({
                status: "success",
                result: products.length,
                products: products,
            });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    createProduct: async (req, res) => {
        try {
            const {
                product_id,
                title,
                price,
                description,
                content,
                images,
                category,
            } = req.body;

            if (!images)
                return res.status(400).json({ msg: "No Image Uploaded" });
            const product = await Products.findOne({ product_id });
            if (product)
                return res
                    .status(400)
                    .json({ msg: "This Product alreatyd exists" });
            const newProduct = new Products({
                product_id,
                title: title.toLowerCase(),
                price,
                description,
                content,
                images,
                category,
            });
            await newProduct.save();
            res.json({ msg: "a Product has been created" });
        } catch (error) {
            return res.status(500).json({ msg: error.message, err: "koko" });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            await Products.findByIdAndDelete(req.params.id);
            res.json({ msg: "Delete a Product" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    updateProduct: async (req, res) => {
        try {
            const {
                title,
                price,
                description,
                content,
                images,
                category,
            } = req.body;

            if (!images)
                return res.status(400).json({ msg: "No Image Uploaded" });
            await Products.findOneAndUpdate(
                { _id: req.params.id },
                {
                    title: title.toLowerCase(),
                    price,
                    description,
                    content,
                    images,
                    category,
                }
            );
            res.json({ msg: "Updated a Product" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
};

module.exports = productsController;
