import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import {createOrder} from './helper/orderHelper';
import { getMeToken, processPayment } from './helper/paymentBTHelper';

import DropIn from 'braintree-web-drop-in-react';

const PaymentBT = ({products, setReload= f => f, reload = undefined}) => {
    const [info, setInfo] = useState({
        loading: false,
        success: false,
        error: "",
        clientToken: null,
        instance: {}
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;
    // const {userId,token} = isAuthenticated(); It is not working. userId is not fetched.

    const getToken = (userId,token) => {
        getMeToken(userId, token).then(data => {
            // console.log("INFORMATION",data)
            if(data.error){
                setInfo({...info, error:data.error});
            }
            else{
                const clientToken =data.clientToken;
                setInfo({clientToken});
            }
        })
    }

    useEffect(() => {
        getToken(userId,token)
    },[]);

    const showbtdropIn = () => {
        return (
            <div>
                {info.clientToken !== null && products.length > 0 ? (
                    <div>
                        <DropIn
                            options={{ authorization: info.clientToken }}
                            onInstance={ (instance) => (info.instance = instance)}
                        />
                        <div class="d-grid">
                            <button className="btn btn-success" onClick={onPurchase}>
                                Buy
                            </button>
                        </div>
                    </div>
                ) : (
                    <h3>Please login or add something to cart</h3>
                )}
            </div>
        );
    };
    
    const onPurchase = () => {
        setInfo({ loading: true });
        let nonce;

        let getNonce = info.instance.requestPaymentMethod().then(data => {
            nonce = data.nonce;
            const paymentData = {
                paymentMethodNonce: nonce,
                amount: getAmount()
            };

            processPayment(userId, token, paymentData)
            .then(response => {
                setInfo({ ...info, success: response.success, loading: false });
                console.log("PAYMENT SUCCESS");
                
                // create order and save in database
                const orderData = {
                    products: products,
                    transaction_id: response.transaction.id,
                    amount: response.transaction.amount
                };

                // create and save order to DataBase.
                createOrder(userId, token, orderData);

                // Empty the cart after successful purchase.
                cartEmpty(() => {
                    console.log("Did we got a crash?");
                });
                
                // Reload
                setReload(!reload);
            })
            .catch(error => {
                setInfo({ loading: false, success: false });
                console.log("PAYMENT FAILED");
            });
        });
    }
    
    const getAmount = () => {
        let amount = 0;
        products.map(product => {
            amount = amount + product.price;
        });
        return amount;
    };
    
    return (
        <div>
            <h3>Your bill amount is Rs {getAmount()}</h3>
            {showbtdropIn()}
        </div>
    );
};
 
export default PaymentBT;