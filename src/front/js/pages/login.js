import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {

    const [ user , setUser ] = useState({})

    const navigate = useNavigate()

    const { store , actions } = useContext(Context)

    const sendCredentials = async () => {
        const isLoged = await actions.login(user);
        if(isLoged){
            navigate("/private")
        }
    }
    return <div className="text-center">
        
        <h1>Login Form</h1>
        <div className="w-75 mx-auto">
            <div className="mb-3">
                <label  className="form-label">Email address</label>
                <input 
                    type="email" className="form-control"
                    value={user.email || ""}
                    onChange={(evt) => setUser({ ...user, email: evt.target.value})}
                />
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input 
                    type="password" className="form-control"
                    value={user.password || ""}
                    onChange={(evt) => setUser({ ...user, password: evt.target.value})}
                />
            </div>
            <button onClick={() => sendCredentials()} className="btn btn-primary">Submit</button>
        </div>
    </div>
}

