import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const navLinkStyle = ({ isActive }) => ({
        color: isActive ? "#fff" : "#e0e0e0",
        backgroundColor: isActive ? "#1565c0" : "transparent",
        textDecoration: "none",
        padding: "6px 12px",
        borderRadius: "4px",
        transition: "0.3s"
    });

    return (
        <AppBar position="static" color="primary">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" component="div">
                    Talep Takip Sistemi
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <NavLink to="/tickets" style={navLinkStyle}>Taleplerim</NavLink>
                    <NavLink to="/create" style={navLinkStyle}>Yeni Talep</NavLink>
                    <Button color="inherit" onClick={handleLogout}>Çıkış Yap</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
