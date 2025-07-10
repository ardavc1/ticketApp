// src/components/Navbar.jsx
import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Divider,
    useMediaQuery,
    Drawer,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BugReportIcon from "@mui/icons-material/BugReport";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import dashboard from "../pages/Dashboard";

const Navbar = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:600px)");
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const username = localStorage.getItem("username") || "kullanici";

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };
    const handleNav = (path) => {
        navigate(path);
        setDrawerOpen(false);
    };

    const navItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Taleplerim", path: "/tickets" },
        { label: "Yeni Talep", path: "/create" },

    ];

    return (
        <AppBar position="sticky" color="primary" elevation={4}>
            <Toolbar>
                <BugReportIcon sx={{ mr: 1 }} />
                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, cursor: "pointer" }}
                    onClick={() => navigate("/tickets")}
                >
                    Talep Takip Sistemi
                </Typography>

                {isMobile ? (
                    <>
                        <IconButton edge="end" color="inherit" onClick={() => setDrawerOpen(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="right"
                            open={drawerOpen}
                            onClose={() => setDrawerOpen(false)}
                        >
                            <Box sx={{ width: 250 }} role="presentation">
                                <List>
                                    {navItems.map((item) => (
                                        <ListItem
                                            button
                                            key={item.label}
                                            onClick={() => handleNav(item.path)}
                                        >
                                            <ListItemText primary={item.label} />
                                        </ListItem>
                                    ))}
                                </List>
                                <Divider />
                                <List>
                                    <ListItem>
                                        <ListItemText primary={`Kullanıcı: ${username}`} />
                                    </ListItem>
                                    <ListItem button onClick={handleLogout}>
                                        <ListItemText primary="Çıkış Yap" />
                                    </ListItem>
                                </List>
                            </Box>
                        </Drawer>
                    </>
                ) : (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.label}
                                color="inherit"
                                onClick={() => navigate(item.path)}
                            >
                                {item.label}
                            </Button>
                        ))}
                        <IconButton color="inherit" onClick={handleMenu}>
                            <AccountCircle />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem disabled>Kullanıcı: {username}</MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
                        </Menu>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
