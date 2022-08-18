import '../styles.css';
import React, { useState, useEffect } from 'react';
import Base from './Base';
import Card from './Card';
import {getProducts} from './helper/coreapicalls';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(false);

    const loadAllProducts = () => {
        getProducts()
        .then(data => {
            if(data.error){
                setError(data.error);
            }
            else{
                setProducts(data);
            }
        })
        .catch(err => console.log(`Can not load products. Error: ${err}`));
    }

    useEffect(() => {
        loadAllProducts();
    },[]);

    return (
        <Base title="Home Page" description="Welcome to the Tshirt Store">
            <div className="row text-center">
                {products.map((product,index) => {
                    return(
                        <div key={index} className="col-3 mb-4">
                            <Card product={product} />
                        </div>
                    );
                })}         
            </div>
        </Base>
    );
}
 
export default Home;