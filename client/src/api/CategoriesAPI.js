import axios from "axios";
import React, { useState, useEffect } from "react";

function CategoriesAPI() {
    const [categories, setCategories] = useState([]);
    const [callback, setCallback] = useState(false);

    useEffect(() => {
        const getCatogries = async () => {
            const res = await axios.get("/api/category");
            setCategories(res.data);
        };
        getCatogries();
    }, [callback]);
    return {
        categories: [categories, setCategories],
        callback: [callback, setCallback],
    };
}

export default CategoriesAPI;
