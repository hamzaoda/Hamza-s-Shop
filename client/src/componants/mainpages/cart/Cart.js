import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function Cart() {
    const state = useContext(GlobalState);
    const [cart, setCart] = state.userAPI.cart;
    const [token] = state.token;
    const [total, setTotal] = useState(0);
    const [isLoading, setLoading] = useState(false)
    const userID = state.userAPI.userID

    useEffect(() => {
        const getTotal = async () => {
            const total = await cart.reduce((prev, item) => {
                return prev + item.price * item.quantity;
            }, 0);
            setTotal(total);
            if (total>0)
                setLoading(true)
        };
        getTotal();
    }, [cart]);

    const addToCart = async (cart) => {
        await axios.patch(
            "/user/addcart",
            { cart },
            {
                headers: { Authorization: token },
            }
        );
    };
    const increment = (id) => {
        cart.forEach((item) => {
            if (item._id === id) {
                item.quantity += 1;
            }
        });
        setCart([...cart]);
        addToCart(cart);
    };
    const decrement = (id) => {
        cart.forEach((item) => {
            if (item._id === id) {
                item.quantity === 1
                    ? (item.quantity = 1)
                    : (item.quantity -= 1);
            }
        });
        setCart([...cart]);
        addToCart(cart);
    };
    const removeProdcut = (id) => {
        if (
            window.confirm("Are you sure that you want to delete this product")
        ) {
            cart.forEach((item, index) => {
                if (item._id === id) {
                    cart.splice(index, 1);
                }
            });
            setCart([...cart]);
            addToCart(cart);
        }
        if(cart.length === 0)
            setLoading(false)
    };
    const transSuccess = async (payment) => {
        // const address = "USA";
        // setPaymentID((prevPaymentID) => prevPaymentID + 1);
        const address = payment.payer.address
        const paymentID = payment.id
        const id = await userID
        await axios.post(
            "/api/payment",
            { cart, paymentID, address, id },
            {
                headers: { Authorization: token },
            },
            { withCredentials: true }
        );
        setLoading(false)
        setCart([]);
        addToCart([])
        alert("you have succefully placed an order");
    };

    if (cart.length === 0) {
        return (
            <div>
                <h2 style={{ textAlign: "center", fontSize: "5rem" }}>
                    {isLoading ? "Loading..." : "Cart is Empty"}
                </h2>
            </div>
        );
    }    
    return (
        <div>
            {cart.map((product) => {
                return (
                    <div className="detail cart" key={product._id}>
                        <img src={product.images.url} alt="" />
                        <div className="box-detail">
                            <h2>{product.title}</h2>
                            <h3>$ {product.price * product.quantity}</h3>
                            <p>{product.description}</p>
                            <p>{product.content}</p>

                            <div className="amount">
                                <button onClick={() => decrement(product._id)}>
                                    -
                                </button>
                                <span>{product.quantity}</span>
                                <button onClick={() => increment(product._id)}>
                                    {" "}
                                    +
                                </button>
                            </div>
                            <div
                                className="delete"
                                onClick={() => removeProdcut(product._id)}
                            >
                                X
                            </div>
                            <Link to="/cart" className="cart">
                                Buy Now
                            </Link>
                        </div>
                    </div>
                );
            })}
            <div className="total">
                <h3>Total : ${total}</h3>
                <PayPalScriptProvider
                    options={{
                        "client-id":
                            "AYyALaQ5JyBU3f8p89j49KG18G9V54Q1uZ6DvVntjA4LMbZ_DV3zQi6Ejhs93ycSDv3pvwKuX8N4bMz3",
                    }}
                >
                    <PayPalButtons
                        style={{ layout: "horizontal" }}
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [
                                    {
                                        amount: {
                                            value: total,
                                            currency_code: "USD",
                                        },
                                    },
                                ],
                            });
                        }}
                        onApprove={(data, actions) => {
                            return actions.order.capture().then((details) => {
                                const name = details.payer.name.given_name;
                                alert(`Transaction completed by ${name}`);
                                transSuccess(details)
                            });
                        }}
                    />
                </PayPalScriptProvider>
            </div>
        </div>
    );
}

export default Cart;
