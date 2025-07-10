// src/components/Navbar.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Destek Sistemi
                </Typography>
                <Button color="inherit" component={Link} to="/tickets">Taleplerim</Button>
                <Button color="inherit" component={Link} to="/create">Yeni Talep</Button>
                <Button color="inherit" onClick={handleLogout}>Çıkış Yap</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
