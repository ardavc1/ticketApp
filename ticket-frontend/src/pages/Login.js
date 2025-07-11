import React, { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Tabs,
    Tab,
    Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [tab, setTab] = useState(0); // 0: Giriş, 1: Kayıt
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [registerSuccess, setRegisterSuccess] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:8080/auth/login", {
                username,
                password
            });

            const token = res.data.token;
            const decoded = JSON.parse(atob(token.split(".")[1]));
            localStorage.setItem("token", token);
            localStorage.setItem("username", decoded.sub); // username (sub)
            navigate("/tickets");
        } catch (err) {
            setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
        }
    };

    const handleRegister = async () => {
        try {
            await axios.post("http://localhost:8080/auth/register", {
                username,
                password,
                role: "USER"
            });
            setRegisterSuccess("Kayıt başarılı! Giriş yapabilirsiniz.");
            setTab(0); // giriş sekmesine dön
            setUsername("");
            setPassword("");
        } catch (err) {
            setError("Kayıt başarısız. Lütfen farklı bir kullanıcı adı deneyin.");
        }
    };

    return (
        <Box sx={{
            background: "linear-gradient(to right, #2c5364, #203a43, #0f2027)",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Paper elevation={6} sx={{ p: 4, width: 360, borderRadius: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Talep Takip Sistemi
                </Typography>

                <Tabs value={tab} onChange={(e, val) => { setTab(val); setError(""); setRegisterSuccess(""); }} centered>
                    <Tab label="Giriş Yap" />
                    <Tab label="Kayıt Ol" />
                </Tabs>

                {tab === 0 && (
                    <>
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
                        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={handleLogin}
                        >
                            Giriş Yap
                        </Button>
                    </>
                )}

                {tab === 1 && (
                    <>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Yeni Kullanıcı Adı"
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
                        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
                        {registerSuccess && <Alert severity="success" sx={{ mt: 1 }}>{registerSuccess}</Alert>}
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={handleRegister}
                        >
                            Kayıt Ol
                        </Button>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default Login;
