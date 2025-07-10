import React, { useState } from "react";
import { Box, Grid, Button, Typography, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SecurityIcon from "@mui/icons-material/Security";
import FeedbackIcon from "@mui/icons-material/Feedback";
import NewTicketForm from "../components/NewTicketForm";
import Navbar from "../components/Navbar"; // 👈 Senin özel Navbar bileşenin burada çağrılıyor

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
    const [selectedType, setSelectedType] = useState(null);

    return (
        <>
            <Navbar /> {/* 👈 Kendi Navbar'ını burada çağırıyoruz */}

            <Box
                sx={{
                    minHeight: "calc(100vh - 64px)", // Navbar yüksekliği dışında tam ekran
                    background: "linear-gradient(to right, #42a5f5, #7b1fa2)", // Arka plan degrade
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
                                        onClick={() => setSelectedType(option.value)}
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
                            onClick={() => setSelectedType(null)}
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
