import React, { useContext, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import axios from 'axios'
function OrderHistory() {
    const state = useContext(GlobalState);
    const [history, setHistory] = state.userAPI.history;
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    useEffect(() => {
        if (token) {
            const getHistory = async () => {
                if (isAdmin) {
                    const res = await axios.get("/api/payment", {
                        headers: { Authorization: token },
                    });
                    await setHistory(res.data);
                } else {
                    const res = await axios.get("/user/history", {
                        headers: { Authorization: token },
                    });
                    await setHistory(res.data.history);
                }
            };
            getHistory();
        }
    }, [token, isAdmin, setHistory]);
    return (
        <div className="history-page">
            <h2>History</h2>
            <h4>You have {history.length} ordered</h4>
            <div >
                <table>
                    <thead>
                        <tr>
                            <th>Payment ID</th>
                            <th>Date Purchesed</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(item => (
                            <tr key={item._id}>
                                <td>{item.paymentID}</td>
                                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <Link to={`/history/${item._id}`}>
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrderHistory;
