import React from "react";
import { useEffect, useContext } from "react";
import { Context } from "../store/appContext"
import { useNavigate } from "react-router-dom";

export const Private = () => {

    const navigate = useNavigate()
    const { store , actions } = useContext(Context)

    useEffect(()=>{
        if(!store.token){
            navigate("/login")
        }
        actions.getProfile()
    },[])

    return <>
        {
            !store.token && 
            <h2>This route is only for Authorized users.</h2>
        }
        {
            store.token && 
            <>
                <h1>
                    { store.profile && store.profile.email}
                </h1>
            </>
        }
    </>
}