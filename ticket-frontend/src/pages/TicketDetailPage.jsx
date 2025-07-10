import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Container,
    Grid,
    Paper,
    Divider,
    Chip,
    Tabs,
    Tab,
    Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getTicketById } from "../services/ticketService";

const priorityMap = {
    LOW: "Düşük",
    MEDIUM: "Orta",
    HIGH: "Yüksek",
};

const statusMap = {
    OPEN: "Açık",
    CLOSED: "Kapalı",
};

const getPriorityColor = (priority) => {
    switch (priority) {
        case "LOW":
            return "#4caf50";
        case "MEDIUM":
            return "#fb8c00";
        case "HIGH":
            return "#f44336";
        default:
            return "#757575";
    }
};

const TicketDetailPage = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    const fetchTicket = async () => {
        try {
            const data = await getTicketById(id);
            setTicket(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const handleTabChange = (_, newValue) => {
        setTabIndex(newValue);
    };

    if (!ticket) return <Container sx={{ mt: 5 }}>Yükleniyor...</Container>;

    return (
        <>
            <Navbar />
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Box>
                    {/* Üst Bilgi ve Sekmeler */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Box>
                            <Typography variant="h6">
                                #{ticket.id} {ticket.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                yapan <b>{ticket.createdBy || "Kullanıcı"}</b> | Tarih: {" "}
                                {new Date(ticket.createdAt).toLocaleString("tr-TR")}
                            </Typography>
                        </Box>
                        <Chip
                            label={`Talep ${priorityMap[ticket.priority]?.toUpperCase() || "SLA"}`}
                            sx={{
                                bgcolor: getPriorityColor(ticket.priority),
                                color: "white",
                                fontWeight: "bold",
                                px: 2,
                                py: 1,
                                fontSize: "0.875rem",
                            }}
                        />
                    </Box>

                    {/* Sekmeler */}
                    <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
                        <Tab label="Ayrıntılar" />
                        <Tab label="Konuşmalar" />
                        <Tab label="Geçmiş" />
                    </Tabs>
                </Box>

                {/* Ana İçerik */}
                <Grid container spacing={4} justifyContent="space-between">
                    {/* Sol Panel */}
                    <Grid item xs={12} lg={9}>
                        <Paper sx={{ p: 3 }}>
                            <Box>
                                {tabIndex === 0 && (
                                    <>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Açıklama
                                        </Typography>
                                        <Box
                                            sx={{
                                                backgroundColor: "#f5f5f5",
                                                borderRadius: 2,
                                                p: 2,
                                                mb: 2,
                                                minHeight: 120,
                                                width: "100%",
                                                whiteSpace: "pre-wrap",
                                                fontSize: "1rem",
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            {ticket.description || "-"}
                                        </Box>
                                        <Button variant="outlined">CEVAPLA</Button>
                                    </>
                                )}

                                {tabIndex === 1 && (
                                    <>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Konuşmalar
                                        </Typography>
                                        <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
                                            <b>System</b> – {new Date(ticket.createdAt).toLocaleString("tr-TR")}
                                            <br />
                                            Ticket oluşturuldu.
                                        </Paper>

                                        {ticket.updatedAt && (
                                            <Paper variant="outlined" sx={{ p: 2 }}>
                                                <b>System</b> – {new Date(ticket.updatedAt).toLocaleString("tr-TR")}
                                                <br />
                                                Ticket güncellendi.
                                            </Paper>
                                        )}
                                    </>
                                )}

                                {tabIndex === 2 && (
                                    <Typography variant="body2" color="text.secondary">
                                        Geçmiş bilgileri yakında burada olacak.
                                    </Typography>
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Sağ Panel */}
                    <Grid item xs={12} lg={3}>
                        <Box
                            component={Paper}
                            elevation={3}
                            sx={{
                                p: 3,
                                backgroundColor: "#fafafa",
                                height: "100%",
                                borderRadius: 3,
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                                Talep Bilgileri
                            </Typography>

                            <Box mb={2}>
                                <Typography variant="caption" color="text.secondary">
                                    Durum
                                </Typography>
                                <Chip
                                    label={statusMap[ticket.status]}
                                    size="small"
                                    sx={{
                                        ml: 1,
                                        bgcolor: ticket.status === "OPEN" ? "#90caf9" : "#e0e0e0",
                                        color: "#000",
                                        fontWeight: "bold",
                                    }}
                                />
                            </Box>

                            <Box mb={2}>
                                <Typography variant="caption" color="text.secondary">
                                    Öncelik
                                </Typography>
                                <Typography>{priorityMap[ticket.priority] || "-"}</Typography>
                            </Box>

                            <Box mb={2}>
                                <Typography variant="caption" color="text.secondary">
                                    Atanan Kişi
                                </Typography>
                                <Typography>{ticket.assignedTo || "Belirtilmedi"}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Oluşturulma Tarihi
                                </Typography>
                                <Typography>
                                    {new Date(ticket.createdAt).toLocaleString("tr-TR")}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default TicketDetailPage;