import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { authenticate, isAuthenticated, signin } from '../auth/helper';
import Base from '../core/Base';

const Signin = () => {
    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
        didRedirect: false
    });
    const { email,password,error,loading,didRedirect } = values;

    const { user } = isAuthenticated();

    const handleChange = valueName => event => {
        setValues({...values, error:false, [valueName]: event.target.value});
    }

    const onSubmit = event => {
        event.preventDefault();
        setValues({...values, error: false, loading: true});
        signin({email, password})
        .then(data => {
            if(data.error){
                setValues({...values, error: data.error, loading: false});
            }
            else{
                // calling authenticate to store jwt in local storage
                authenticate(data, () => {
                    setValues({...values,
                    email:"",
                    password:"",
                    error:"",
                    loading:false,
                    didRedirect: true});
                });
            }
        })
        .catch( console.log("SignIn request failed") );
    }

    // do a redirection.
    const performRedirect = () => {
        if(didRedirect){
            if(user && user.role===1) {
                return <Redirect to="/admin/dashboard" />
            }
            else {
                return <Redirect to="/user/dashboard" />
            }
        }

        if(isAuthenticated()){
            return <Redirect to="/" />
        }
    }

    const loadingMessage = () => {
        return(
            loading && (
                <div className="row">
                    <div className="col-md-6 offset-sm-3 text-left">
                        <div className="alert alert-info">
                            <h2>Loading...</h2>
                        </div>
                    </div>
                </div>
            )
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

    const signInForm = () => {
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
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

    return (
        <Base title="Sign In Page" description="A page for user to Sign In.">
            <h1>Sign In Works</h1>
            { loadingMessage() }
            { errorMessage() }
            { signInForm() }
            { performRedirect() }
            {/* <p className="text-white text-center">{JSON.stringify(values)}</p> */}
        </Base>
    );
}
 
export default Signin;