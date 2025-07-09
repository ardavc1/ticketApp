import React, { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Alert
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:8080/auth/login", {
                username,
                password
            });

            const token = res.data.token;
            localStorage.setItem("token", token); // Token'ı sakla

            // Yönlendirme (örneğin anasayfa)
            navigate("/dashboard");
        } catch (err) {
            setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h5">Giriş Yap</Typography>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Kullanıcı Adı"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    type="password"
                    label="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <Alert severity="error" sx={{ width: "100%", mt: 1 }}>{error}</Alert>}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleLogin}
                >
                    Giriş Yap
                </Button>
            </Box>
        </Container>
    );
};

export default Login;