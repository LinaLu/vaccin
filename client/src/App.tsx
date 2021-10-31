import React, {useEffect, useState} from 'react';
import VaccineDelivery from "./screens/VaccineDelivery";
import Login from "./screens/Login";
import {Container} from "react-bootstrap";

export interface User {
    id: string;
    is_admin: boolean;
    name: string;
}

function App() {

    const [user, setUser] = useState<User>()

    useEffect(() => {
        if (user){
            localStorage.setItem("ACCOUNT_ID", user.id)
        }

    }, [user, setUser])

    return (
        <Container fluid style={{ padding: 10 }}>
            {user ? <VaccineDelivery isAdmin={user.is_admin}/> : <Login handleLogin={setUser}/>}
        </Container>
    );
}

export default App;
