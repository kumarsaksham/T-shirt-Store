import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Base from '../core/Base';
import { signup } from '../auth/helper'

const Signup = () => {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        error: "",
        success: false
    });

    const { name,email,password,error,success } = values;

    //Read about higher order functions.
    const handleChange = valueName => event => {
        setValues({...values, error:false, [valueName]: event.target.value});
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setValues({...values,error:false});
        signup({name, email, password})
        .then( data => {
            if(data.error){
                setValues({...values, error:data.error, success: false});
            }
            else{
                setValues({...values,
                name: "",
                email: "",
                password:"",
                error:"",
                success: true
                });
            }
        })
        .catch(err => console.log("Error in signup"));
    }

    const signUpForm = () => {
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className="form-group">
                            <label className="text-light">Name</label>
                            <input onChange={handleChange("name")} value={name} type="text" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label className="text-light">Email</label>
                            <input onChange={handleChange("email")} value={email} type="email" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label className="text-light">Password</label>
                            <input onChange={handleChange("password")} value={password} type="password" className="form-control"/>
                        </div>

                        <div className="d-grid py-3">
                            <button onClick={onSubmit} className="btn btn-success">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    const successMessage = () => {
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-success" style={{display: success ? "" : "none"}}>
                        New account is created successfully. Please <Link to="/signin"> login here.</Link>
                    </div>
                </div>
            </div>
        );
    }

    const errorMessage = () => {
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-danger" style={{display: error ? "" : "none"}}>
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Base title="Sign Up Page" description="A page for user to Sign Up!">
            <h1>Sign Up Works</h1>
            { successMessage() }
            { errorMessage() }
            { signUpForm() }
            {/* <p className="text-white text-center">{JSON.stringify(values)}</p> */}
        </Base>
    );
}
 
export default Signup;