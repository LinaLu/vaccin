import React, {useState} from 'react';
import {Button, Container, Form, Stack} from "react-bootstrap";
import {User} from "../App";
import {useFetchWrapper} from "../utils/fetchWrapper";

export interface LoginProps {
    handleLogin: (user: User) => void
}

export default function Login({handleLogin}: LoginProps) {

    const [accountName, setAccountName] = useState<string>();
    const api = useFetchWrapper();

    const onLoginClick = async () => {
        if (accountName){
            const user:User = await api.post("/api/user/login", {name: accountName})
            if (user){
                localStorage.setItem("ACCOUNT_ID", user.id)
                handleLogin(user);
            }
        }
    }

    const onRegisterClick = async () => {
        if (accountName){
            await api.post("/api/user/register", {name: accountName})
                .then(_ => alert(accountName + " registered!"))            
                .catch(error => alert(error))
            
        }
    }

    return (
        <Container className="d-flex align-items-center justify-content-center">
            <Stack direction="horizontal" gap={3}>
                <Form.Control className="me-auto" placeholder="Account name" onChange={(e) => setAccountName(e.target.value)} />
                <Button onClick={onLoginClick} variant="primary">Login</Button>
                <Button onClick={onRegisterClick} variant="secondary">Register</Button>
            </Stack>
        </Container>
    )
}