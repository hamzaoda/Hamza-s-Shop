const Payments = require('../Models/paymentModel')
const Users = require('../Models/userModel')
const Products = require('../Models/productModel')


const paymentController ={
    getPayments: async (req, res) =>{
        try {
            const payments = await Payments.find()
            res.json(payments)
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    createPayment: async (req, res) =>{
        try {
            const user = await Users.findById(req.body.id).select('name email')
            if(!user) return res.status(400).json({msg: "User does not exist"})
            const {cart, paymentID, address} = req.body;
            const {_id, name, email} = user
            const newPayment = await new Payments({
                user_id:_id, name, email, cart, paymentID, address 
            })
            cart.filter(item => {
                return sold(item._id, item.quantity, item.sold), console.log('the sold has been updated');
            })
            await newPayment.save()
            res.json({mag : "Payment Success"})

        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
}
const sold = async(id, quantity, oldSold)=>{
    await Products.findOneAndUpdate({_id: id}, {
        sold: quantity + oldSold
    })
}

module.exports = paymentController