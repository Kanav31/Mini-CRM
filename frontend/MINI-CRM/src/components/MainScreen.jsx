import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import CustomerTable from './Customer';
const MainScreen = () => {

    const navigate = useNavigate();

    const getUser = async () => {
        try {
            const response = await axios.get("http://localhost:3000/login/sucess", { withCredentials: true });

            console.log("response", response)
        } catch (error) {
            navigate("*")
        }
    }


    useEffect(() => {
        getUser()
    }, [])
    return (
        <div style={{ textAlign: "center" }}>
            <CustomerTable />
        </div>
    )
}

export default MainScreen