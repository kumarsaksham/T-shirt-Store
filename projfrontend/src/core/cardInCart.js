import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import ImageHelper from "./helper/ImageHelper";
import { addItemToCart, removeItemFromCart } from './helper/cartHelper'


const CardInCart = ({
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

    // const getRedirect = (redirect) => {
    //     if(redirect){
    //         return <Redirect to="/cart" />
    //     }
    // }

    // const showAddToCart = (addToCart) => {
    //     return(
    //         addToCart && (
    //             <button
    //             onClick={addProductToCart}
    //             className="btn btn-outline-success"
    //             >
    //             Add to Cart
    //             </button>
    //         )
    //     );
    // }

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
        <div className="row text-white bg-dark border border-info p-3">
            <div className="col-4"><ImageHelper product={product} /></div>
            <div className="col-4">
                <p>{ cardTitle }</p>
                <p>{cardDescription}</p>
                <p>Rs {cardPrice}</p>
                {/* <div className="d-grid gap-2"> */}
                    {/* {showAddToCart(addToCart)} */}
                    {showRemoveFromCart(removeFromCart)}  
                {/* </div> */}
            </div>
            <div className="col-4">
                <p>Dilivery within 7 working Days</p>
                <p>10 Days Replacement Policy</p>
            </div>
        </div>
    );
};
 
export default CardInCart;