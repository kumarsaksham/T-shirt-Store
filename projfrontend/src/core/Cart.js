import '../styles.css';
import React, { useState, useEffect } from 'react';
import Base from './Base';
import Card from './Card';
import { loadCart } from './helper/cartHelper';
import PaymentBT from './PaymentBT';
import CardInCart from './cardInCart';
import { Redirect } from 'react-router';

const Cart = () => {
    const [products, setProducts] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        setProducts(loadCart())
    },[reload]);

    // const loadAllProducts = (products) => {
    //     return( 
    //         {products.map((product,index) => {
    //             return(
    //                 <div key={index} className="col-3 mb-4">
    //                     <Card key={index} product={product} 
    //                     addToCart={false} removeFromCart={true}
    //                     setReload={setReload} reload={reload}
    //                     />
    //                 </div>
    //             );
    //         })}
    //     );
    // }

    const loadCheckOut = () => {
        return(
            <h1>This section is for checkout</h1>
        );
    }

    const getAmount = (products) => {
        let amount = 0;
        if(products.length > 0){
            products.map(product => {
                amount = amount + product.price;
            });
        }
        return amount;
    };

    const goToCheckout = () => {
        setRedirect(true);
    }

    const getRedirect = (redirect) => {
        if(redirect){
            return <Redirect to="/checkout" />
        }
    }

    return (
        <Base title="Cart Page" description="Ready to checkout">
            {getRedirect(redirect)}
            { products.length > 0 ? (
                <div className="row ">
                    <div className="col-8 ">
                        <div className="row" >
                            { products.map((product,index) => {
                                return(
                                    <div key={index} className="col-12 mb-4">
                                        <CardInCart key={index} product={product} 
                                        addToCart={false} removeFromCart={true}
                                        setReload={setReload} reload={reload}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="col-4">
                        <div className="border border-info p-4 mb-2">
                            <div className="h2 text-center border-bottom border-light pb-2">Price Details</div>
                            <div>
                                <h4 >Price: {getAmount(products)} </h4>
                                <h4 >Delivery Charge: FREE</h4>
                                <h4 >Total Amount: {getAmount(products)}</h4>    
                            </div> 
                        </div>
                        <div class="d-grid gap-2">
                            <button onClick={goToCheckout} class="btn btn-success" type="button">Place Order</button>
                        </div>
                        
                        {/* <PaymentBT products={products} setReload={setReload} /> */}
                    </div>    
                </div>
            ) : (
                <div>No Products In Cart.</div>
            ) }
            


        </Base>
    );
}
 
export default Cart;