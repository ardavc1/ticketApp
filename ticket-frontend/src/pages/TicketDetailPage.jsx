// TicketDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Paper,
    Button,
    Box,
    Chip,
    CircularProgress,
} from "@mui/material";
import { getTicketById, toggleTicketStatus } from "../services/ticketService";

const priorityColors = {
    LOW: "default",
    MEDIUM: "warning",
    HIGH: "error",
};

const TicketDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTicket = async () => {
        try {
            const data = await getTicketById(id);
            setTicket(data);
        } catch (error) {
            console.error("Talep alınamadı", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        try {
            await toggleTicketStatus(id);
            fetchTicket();
        } catch (error) {
            console.error("Durum değiştirilemedi", error);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, [id]);

    if (loading || !ticket) {
        return (
            <Container maxWidth="sm" style={{ marginTop: 40 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" style={{ marginTop: 40 }}>
            <Paper elevation={4} style={{ padding: 32, borderRadius: 16 }}>
                <Typography variant="h4" gutterBottom>
                    {ticket.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {ticket.description}
                </Typography>

                <Box display="flex" flexDirection="column" gap={1} mt={2}>
                    <Box>
                        <Typography variant="subtitle2">Durum:</Typography>
                        <Chip
                            label={ticket.status === "OPEN" ? "Açık" : "Kapalı"}
                            color={ticket.status === "OPEN" ? "success" : "error"}
                            size="small"
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle2">Öncelik:</Typography>
                        <Chip
                            label={
                                ticket.priority === "LOW"
                                    ? "Düşük"
                                    : ticket.priority === "HIGH"
                                        ? "Yüksek"
                                        : "Orta"
                            }
                            color={priorityColors[ticket.priority] || "default"}
                            size="small"
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle2">Atanan:</Typography>
                        <Typography variant="body2">
                            {ticket.assignedTo || "Belirtilmedi"}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2">Oluşturulma Tarihi:</Typography>
                        <Typography variant="body2">
                            {new Date(ticket.createdAt).toLocaleString("tr-TR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Typography>
                    </Box>
                </Box>

                <Box mt={4} display="flex" gap={2}>
                    <Button
                        variant="contained"
                        color={ticket.status === "OPEN" ? "error" : "success"}
                        onClick={handleToggleStatus}
                    >
                        {ticket.status === "OPEN" ? "Kapat" : "Açık Yap"}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate("/tickets")}>Geri Dön</Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default TicketDetailPage;
