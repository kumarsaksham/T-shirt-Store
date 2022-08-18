import React, { useEffect, useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { createProduct, getAllCategories } from './helper/adminapicall';
import { isAuthenticated } from "../auth/helper";

// TODO: Assignment 16.08 : Redirect after 2sec

const AddProduct = () => {
    const { user, token } = isAuthenticated();

    const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    success: false,
    error: "",
    createdProduct: "",
    getRedirect: false,
    formData: ""
    });

    const { 
    name, 
    description, 
    price, 
    stock, 
    categories, 
    category, 
    loading,
    success,
    error, 
    createdProduct, 
    getRedirect, 
    formData 
    } = values;

    const preload = () => {
        // load categories
        getAllCategories().then(data => {
            // console.log(data);
            if(data.error){
                setValues({...values, error: data.error})
            }
            else{
                setValues({...values, categories: data, formData: new FormData()});
                // console.log(categories);
            }
        })
    }

    useEffect( () => {
        preload();
    },[]);

    const handleChange = name => event => {
        const value = ( name==="photo" ? event.target.files[0] : event.target.value );
        formData.set(name,value);
        setValues({...values, [name]: value, success:false});
    };

    const onSubmit = (event) => {
        event.preventDefault();
        setValues({...values, error: "", loading: true});

        // backend call to create product
        createProduct(user._id, token, formData)
        .then( data => {
            if(data.error){
                setValues({...values, success:false, error: data.error});
            }
            else{
                setValues({...values, 
                    name: "",
                    description: "",
                    price: "",
                    stock: "",
                    photo: "",
                    category: "",
                    loading: false,
                    success: true,
                    error:"",
                    createdProduct: data.name,
                    getRedirect: true,
                });
            }
        })
    };

    // TODO: delay is not working.
    // const performRedirect = () => {
    //     if(getRedirect && success){
    //         return setTimeout(function(){
    //             return <h1>Redirect Working</h1>
    //         }, 2000);
    //     }
    // }

    const successMessage = () => {
        return(
            <div 
                className="alert alert-success mt-3"
                style={{display: success ? "" : "none" }}
            >
                <h4>{createdProduct} created successfully.</h4>
            </div>
        )
    }

    const warningMessage = () => {
        return(
            <div 
                className="alert alert-danger mt-3"
                style={{display: error ? "" : "none" }}
            >
                <h4>{error}</h4>
            </div>
        );
    }

    const createProductForm = () => (
        <form>
            <span>Post photo</span>
            <div className="form-group mb-3">
            <label className="btn btn-block btn-success">
                <input
                onChange={handleChange("photo")}
                type="file"
                name="photo"
                accept="image"
                placeholder="choose a file"
                />
            </label>
            </div>
            <div className="form-group mb-3">
            <input
                onChange={handleChange("name")}
                name="photo"
                className="form-control"
                placeholder="Name"
                value={name}
            />
            </div>
            <div className="form-group mb-3">
            <textarea
                onChange={handleChange("description")}
                name="photo"
                className="form-control"
                placeholder="Description"
                value={description}
            />
            </div>
            <div className="form-group mb-3">
            <input
                onChange={handleChange("price")}
                type="number"
                className="form-control"
                placeholder="Price"
                value={price}
            />
            </div>
            <div className="form-group mb-3">
            <select
                onChange={handleChange("category")}
                className="form-control"
                placeholder="Category"
            >
                <option>Select</option>
                {categories &&
                categories.map((category, index) => (
                    <option key={index} value={category._id}>
                    {category.name}
                    </option>
                ))}
            </select>
            </div>
            <div className="form-group mb-3">
            <input
                onChange={handleChange("stock")}
                type="number"
                className="form-control"
                placeholder="Stock"
                value={stock}
            />
            </div>

            <button
            type="submit"
            onClick={onSubmit}
            className="btn btn-outline-success mb-3"
            >
            Create Product
            </button>
        </form>
    );

    return (
    <Base
        title="Add a product here!"
        description="Welcome to product creation section"
        className="container bg-info p-4"
    >
        <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
            Admin Home
        </Link>
        <div className="row bg-dark text-white rounded">
            <div className="col-md-8 offset-md-2">
                { successMessage() }
                { warningMessage() }
                { createProductForm() }
                {/* { performRedirect() } */}
            </div>
        </div>
    </Base>
    );
};

export default AddProduct;
