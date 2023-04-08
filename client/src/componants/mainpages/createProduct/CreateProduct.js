import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import Loading from "../utils/loading/Loading";
import { useNavigate, useParams } from "react-router-dom";

const initialState = {
    product_id: "",
    title: "",
    price: 0,
    description: "",
    content: "",
    category: "",
    _id: "",
};

function CreateProduct() {
    const state = useContext(GlobalState);
    const [product, setProduct] = useState(initialState);
    const [categories] = state.categoriesAPI.categories;
    const [images, setImages] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAdmin] = state.userAPI.isAdmin;
    const [token] = state.token;
    const navigate = useNavigate();
    const param = useParams();
    const [products] = state.productsAPI.products;
    const [onEdit, setOnEdit] = useState(false);
    const [callback, setCallback] = state.productsAPI.callback

    useEffect(() => {
        if (param.id) {
            setOnEdit(true);
            products.forEach(product => {
                if (product._id === param.id) {
                    setProduct(product);
                    setImages(product.images);
                }
            });
        } else {
            
            setOnEdit(false);
            setProduct(initialState);   
            setImages(false);
        }
    }, [param.id, products]);

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            if (!isAdmin) return alert("YOU ARE NOT AN ADMIN");
            const file = e.target.files[0];

            if (!file) return alert("File not Exist");

            if (file.size > 1024 * 1024) return alert("Size to Large");

            if (file.type !== "image/jpeg" && file.type !== "image/png")
                return alert("file format is incorrect");

            let formData = new FormData();
            formData.append("file", file);
            setLoading(true);
            const res = await axios.post("api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: token,
                },
            });
            setLoading(false);
            setImages(res.data);
        } catch (error) {
            alert(error.response.data.msg);
        }
    };
    const handleDelete = async () => {
        try {
            if (!isAdmin) return alert("YOU ARE NOT AN ADMIN");
            setLoading(true);
            const res = await axios.post(
                "/api/destroy",
                { public_id: images.public_id },
                {
                    headers: { Authorization: token },
                }
            );
            setLoading(false);
            setImages(false);
        } catch (error) {
            alert(error.response.data.msg);
        }
    };
    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!isAdmin) return alert("YOU ARE NOT AN ADMIN");
            if (!images) return alert("you didn't upload an image");
            if (onEdit) {
                await axios.put(
                    `http://localhost:5000/api/products/${product._id}`,
                    { ...product, images },
                    {
                        headers: { Authorization: token },
                    }
                );
            } else {
                await axios.post(
                    "http://localhost:5000/api/products",
                    { ...product, images },
                    {
                        headers: { Authorization: token },
                    }
                );
            }
            setCallback(!callback)
            navigate("/");
        } catch (error) {
            console.log(error.response.data);
            alert(error.response.data.msg);
        }
    };
    const styleUpload = {
        display: images ? "block" : "none",
    };

    return (
        <div className="create-product">
            <div className="upload">
                <input
                    type="file"
                    name="file"
                    id="file_up"
                    onChange={handleUpload}
                />
                {loading ? (
                    <div>
                        <Loading />
                    </div>
                ) : (
                    <div id="file_img" style={styleUpload}>
                        <img src={images ? images.url : ""} alt="" />
                        <span onClick={handleDelete}>X</span>
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="product_id">Product ID</label>
                    <input
                        type="text"
                        name="product_id"
                        id="product_id"
                        required
                        value={product.product_id}
                        onChange={handleChangeInput}
                        disabled={onEdit}
                    ></input>
                </div>

                <div className="row">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={product.title}
                        onChange={handleChangeInput}
                    ></input>
                </div>

                <div className="row">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        required
                        value={product.price}
                        onChange={handleChangeInput}
                    ></input>
                </div>

                <div className="row">
                    <label htmlFor="description">Description</label>
                    <textarea
                        type="text"
                        name="description"
                        id="description"
                        required
                        value={product.description}
                        onChange={handleChangeInput}
                        rows="5"
                    ></textarea>
                </div>

                <div className="row">
                    <label htmlFor="content">Content</label>
                    <textarea
                        type="text"
                        name="content"
                        id="content"
                        required
                        value={product.content}
                        rows="7"
                        onChange={handleChangeInput}
                    ></textarea>
                </div>

                <div className="row">
                    <label htmlFor="categories">Categories</label>
                    <select
                        className="select"
                        name="category"
                        value={product.category}
                        onChange={handleChangeInput}
                    >
                        <option value="">Please Select a Category</option>
                        {categories.map((category) => (
                            <option value={category._id} key={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">{onEdit ? "Update" : "Create"}</button>
            </form>
        </div>
    );
}

export default CreateProduct;
