import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import ImageHelper from "./helper/ImageHelper";
import { addItemToCart, removeItemFromCart } from './helper/cartHelper'


const Card = ({
    product, addToCart = true, removeFromCart = false,
    setReload = f => f,
    reload = undefined
}) => {
    const [redirect, setRedirect] = useState(false);
    const [count, setCount] = useState(product.count);

    const cardTitle = product ? product.name : "Default name";
    const cardDescription = product ? product.description : "Default description";
    const cardPrice = product ? product.price : "Default Price";

    const addProductToCart = () => {
        addItemToCart(product, () => setRedirect(true));
    }

    const getRedirect = (redirect) => {
        if(redirect){
            return <Redirect to="/cart" />
        }
    }

    const showAddToCart = (addToCart) => {
        return(
            addToCart && (
                <button
                onClick={addProductToCart}
                className="btn btn-outline-success"
                >
                Add to Cart
                </button>
            )
        );
    }

    const showRemoveFromCart = (removeFromCart) => {
        return(
            removeFromCart && (
                <button
                onClick={() => {
                    removeItemFromCart(product._id);
                    setReload(!reload);
                }}
                className="btn btn-outline-danger"
                >
                Remove from cart
                </button>
            )
        );
    }

    return (
        <div className="card text-white bg-dark border border-info ">
            <div className="card-header lead">{ cardTitle }</div>
            <div className="card-body">
                {getRedirect(redirect)}
                <ImageHelper product={product} />
                <p className="lead bg-success font-weight-normal text-wrap">
                    {cardDescription}
                </p>
                <p className="btn btn-success rounded  btn-sm px-4">Rs {cardPrice}</p>
                <div className="d-grid gap-2">
                    {showAddToCart(addToCart)}
                    {showRemoveFromCart(removeFromCart)}
                    
                </div>
            </div>
        </div>
    );
};
 
export default Card;