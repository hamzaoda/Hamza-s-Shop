import React, { useContext, useEffect, useState} from "react";
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/ProductItem/ProductItem'
import Loading from '../utils/loading/Loading'
import axios from 'axios'
import Filters from './Filters'
import LoadMore from './LoadMore'


function Product() {
    const state = useContext(GlobalState)
    const [products, setProducts] = state.productsAPI.products
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    const [callback, setCallback] = state.productsAPI.callback
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)

    const handleCheck = (id) => {
        products.forEach(product => {
            if (product._id === id) product.checked = !product.checked
        });
        setProducts([...products])
    }
    const deleteProduct = async (id, public_id) => {
        try {
            setLoading(true)
            const destroyImg = axios.post('/api/destroy', {public_id}, {
                headers:{Authorization:token}
            })
            const deleteProduct = axios.delete(`/api/products/${id}`, {
                headers:{Authorization:token}
            })
            await destroyImg
            await deleteProduct
            setCallback(!callback)
            setLoading(false)
        } catch (error) {
            alert(error.response.data + " i don't know what is this error")
        }
    }
    const checkAll = () => {
        products.forEach(product =>{
            product.checked = !isCheck
        })
        setProducts([...products])
        setIsCheck(!isCheck)
    }
    const deleteAll = ()=> {
        products.forEach(product=>{
            if(product.checked) deleteProduct(product._id, product.images.public_id)
        })
    }
    if(loading) return <div ><Loading/></div>
    return (
        <div>
        <Filters/>
        {
            isAdmin && 
            <div className="delete-all">
                <span>Select all</span>
                <input type="checkbox" checked={isCheck} onChange={() => checkAll()} />
                <button onClick={deleteAll}>Delete ALL</button>
            </div>
        }
        <div className="products">
            {
                products.map(product => {
                    return <ProductItem key={product._id} product={product} isAdmin={isAdmin} deleteProduct={deleteProduct}  handleCheck={handleCheck}/>
                })
            }
            </div>
            <LoadMore/>
    { products.length === 0 && <Loading /> }
    </div>
    );
}

export default Product;
