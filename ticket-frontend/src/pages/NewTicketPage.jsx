import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Typography, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SecurityIcon from "@mui/icons-material/Security";
import FeedbackIcon from "@mui/icons-material/Feedback";
import NewTicketForm from "../components/NewTicketForm";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";

const ticketOptions = [
    {
        label: "Sorunum Var",
        value: "ISSUE",
        color: "#e74c3c",
        icon: <ReportProblemIcon fontSize="large" />,
    },
    {
        label: "Talebim Var",
        value: "REQUEST",
        color: "#1abc9c",
        icon: <AddIcon fontSize="large" />,
    },
    {
        label: "Bilgi Güvenliği İhlali",
        value: "SECURITY",
        color: "#f39c12",
        icon: <SecurityIcon fontSize="large" />,
    },
    {
        label: "Geri Bildirim",
        value: "FEEDBACK",
        color: "#9b59b6",
        icon: <FeedbackIcon fontSize="large" />,
    },
];

const NewTicketPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // URL'den category parametresini al
    const { category } = queryString.parse(location.search);
    const [selectedType, setSelectedType] = useState(null);

    // URL'deki category varsa otomatik olarak set et
    useEffect(() => {
        if (category && ticketOptions.find((t) => t.value === category)) {
            setSelectedType(category);
        }
    }, [category]);

    // Butona tıklanınca URL değişsin ve state güncellensin
    const handleTypeSelect = (type) => {
        navigate(`?category=${type}`);
    };

    const handleBack = () => {
        setSelectedType(null);
        navigate("/new");
    };

    return (
        <>
            <Navbar />

            <Box
                sx={{
                    minHeight: "calc(100vh - 64px)",
                    background: "linear-gradient(to right, #42a5f5, #7b1fa2)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: 6,
                }}
            >
                {!selectedType ? (
                    <>
                        <Typography variant="h5" color="white" mb={4}>
                            Size nasıl yardımcı olabiliriz?
                        </Typography>
                        <Grid container spacing={4} justifyContent="center" maxWidth="md">
                            {ticketOptions.map((option) => (
                                <Grid item xs={12} sm={6} md={3} key={option.value}>
                                    <Paper
                                        elevation={6}
                                        sx={{
                                            backgroundColor: option.color,
                                            color: "#fff",
                                            p: 3,
                                            textAlign: "center",
                                            cursor: "pointer",
                                            transition: "transform 0.2s",
                                            "&:hover": {
                                                transform: "scale(1.05)",
                                            },
                                        }}
                                        onClick={() => handleTypeSelect(option.value)}
                                    >
                                        <Box>{option.icon}</Box>
                                        <Typography variant="h6" mt={1}>
                                            {option.label}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                mt: 2,
                                                backgroundColor: "#fff",
                                                color: option.color,
                                                fontWeight: "bold",
                                                "&:hover": {
                                                    backgroundColor: "#f5f5f5",
                                                },
                                            }}
                                        >
                                            {option.label.toUpperCase()}
                                        </Button>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                ) : (
                    <Box width="100%" maxWidth="lg" px={2}>
                        <Button
                            onClick={handleBack}
                            variant="outlined"
                            sx={{ mb: 2, color: "white", borderColor: "white" }}
                        >
                            ← Geri Dön
                        </Button>
                        <NewTicketForm selectedType={selectedType} />
                    </Box>
                )}
            </Box>
        </>
    );
};

export default NewTicketPage;
