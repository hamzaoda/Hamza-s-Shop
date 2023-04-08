import React, { useState, useEffect } from "react";
import axios from "axios";

function UserAPI(token) {
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cart, setCart] = useState([]);
    const [userID, setUserID] = useState("");
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (token) {
            const getUser = async () => {
                try {
                    const res = await axios.get("/user/infor", {
                        headers: { Authorization: token },
                    });
                    await setIsLogged(true);
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
                    setCart(res.data.cart);
                    setUserID(res.data._id);
                } catch (error) {
                    alert(error.response.data.msg);
                }
            };
            getUser();
        }
    }, [token, isAdmin]);
    const addCart = async (product) => {
        if (!isLogged) return alert("please login to countinue buying");
        const check = cart.every((item) => {
            return item.id !== product._id;
        });
        if (check) {
            setCart([...cart, { ...product, quantity: 1 }]);
            await axios.patch(
                "/user/addcart",
                { cart: [...cart, { ...product, quantity: 1 }] },
                {
                    headers: { Authorization: token },
                }
            );
        } else {
            alert("This porduct has been added to the cart");
        }
    };

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        userID: userID,
        addCart: addCart,
        history: [history, setHistory],
    };
}

export default UserAPI;
