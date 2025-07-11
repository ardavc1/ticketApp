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

const Navbar = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:600px)");
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const username = localStorage.getItem("username") || "kullanici";

    // ✅ Kullanıcının rolünü token'dan çek
    const token = localStorage.getItem("token");
    let role = null;
    if (token) {
        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            role = decoded.role;
        } catch (e) {
            console.error("Token decode hatası:", e);
        }
    }

    // ✅ Role göre nav item'ları belirle
    const navItems = [
        ...(role === "ADMIN" ? [{ label: "Dashboard", path: "/dashboard" }] : []),
        ...(role === "ADMIN" ? [{ label: "Tüm Talepler", path: "/alltickets" }] : []),
        { label: "Taleplerim", path: "/tickets" },
        { label: "Yeni Talep", path: "/new" },
    ];

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/login");
    };

    const handleNav = (path) => {
        navigate(path);
        setDrawerOpen(false);
    };

    return (
        <AppBar position="sticky" elevation={4} sx={{ backgroundColor: '#111010' }}>
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
