const Users = require("../Models/userModel");
const Payments = require("../Models/paymentModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const user = await Users.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: "the email is already exists" });
            }
            if (password.length < 6) {
                return res
                    .status(400)
                    .json({ msg: "Password is at least 6 Characters" });
            }
            //password encryption
            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = new Users({
                name,
                email,
                password: passwordHash,
            });
            //save the user to mongodb
            await newUser.save();

            //create jsonwebtoken to authentication
            const accessToken = createAccessToken({ id: newUser._id });
            const refreshtoken = createRefreshToken({ id: newUser._id });
            res.cookie("refreshtoken", refreshtoken, {
                httpOnly: true,
                path: "/user/refresh_token",
                maxAge: 7*24*60*60*1000,
            });
            res.json({accessToken})
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email });
            if (!user)
                return res.status(400).json({ msg: "User does not exist" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({ msg: "Incorect Password" });

            //if account is found create access token and refresh token
            const accessToken = createAccessToken({ id: user._id });
            const refreshtoken = createRefreshToken({ id: user._id });
            res.cookie("refreshtoken", refreshtoken, {
                httpOnly: true,
                path: "/user/refresh_token",
                maxAge: 7*24*60*60*1000 //7d,
            });
            res.json({ accessToken });
        } catch (err) {
            return res.status(500).json({ msg: err.message+ "   koko"});
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
            return res.json({ msg: "logged out" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token)
                return res
                    .status(400)
                    .json({ msg: "Please Login sssssss or Register" });
            jwt.verify(
                rf_token,
                process.env.REFRESH_TOKEN_SECRET,
                (err, user) => {
                    if (err)
                        return res
                            .status(400)
                            .json({ msg: "Please Login or Register"});
                    const accessToken = createAccessToken({ id: user.id });
                    res.json({ user, accessToken });
                }
            );
        } catch (err) {
            return res.status(500).json({ msg: err.msg });
        }
    },
    getUser : async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg : "User does not exists"})
            res.json(user)

        } catch (err) {
            return res.status(500).json({ msg: err.msg });
        }
    },
    addCart :async (req, res)=> {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg:"User does not exist"})

            await Users.findOneAndUpdate({_id :req.user.id}, {
                cart : req.body.cart
            })
            return res.json({msg: "Added to the cart"})
        } catch (error) {
            return res.status(500).json({msg : error.message})
        }
    },
    getHistory : async (req, res)=>{
        try {
            const history = await Payments.find({user_id:req.user.id});
            return res.json({history})
        } catch (error) {
            return res.status(500).json({msg : error.message})
        }
    }
};

const createAccessToken = (user) => {
    var sign = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "3600s",
    });
    return sign;
};
const createRefreshToken = (user) => {
    var sign = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
    });
    return sign;
};

module.exports = userController;
