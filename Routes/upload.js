require("dotenv").config();
const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const auth = require("../Middlewares/auth");
const authAdmin = require("../Middlewares/authAdmin");
const fs = require("fs");

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET,
// });
//upload image only admin can use
router.post("/upload", auth, authAdmin, (req, res) => {
    cloudinary.config({
        cloud_name: "djqayi7cr",
        api_key: "658818674714242",
        api_secret: "UzOh3d6vMarx739IEaf86LCQ40M",
    });
    try {
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: "No Files were Uploaded" });

        const file = req.files.file;
        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath);
            //if file size > 1mb
            return res.status(400).json("Size too Large ");
        }

        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ msg: "File Format Is Incorrect" });
        }
        cloudinary.uploader.upload(
            file.tempFilePath,
            {
                folder: "test",
                use_filename: true,
                unique_filename: false,
                filename_override: file.name,
            },
            async (err, result) => {
                if (err) {
                    return res.status(500).json({ msg: err.message });
                }
                // Delete the temporary file
                removeTmp(file.tempFilePath);
                res.json({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
        );
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});
//delete image only admin can use
router.post("/destroy", auth, authAdmin, (req, res) => {
    try {
        const { public_id } = req.body;
        if (!public_id)
            return res.status(400).json({ msg: "No Image Selected" });
        cloudinary.uploader.destroy(public_id, async (err, result) => {
            if (err) throw err;
            res.json({ msg: "Deleted Image" });
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message , koko:"i don't know the error"});
    }
});
const removeTmp = (path) => {
    fs.unlink(path, (err) => {
        if (err) throw err;
    });
};

module.exports = router;
