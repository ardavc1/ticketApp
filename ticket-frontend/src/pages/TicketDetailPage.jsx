// src/pages/TicketDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTicketById } from "../services/ticketService";
import {
    Container,
    Typography,
    CircularProgress,
    Box,
    Chip,
    Paper,
} from "@mui/material";
import { format } from "date-fns";

const TicketDetailPage = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const data = await getTicketById(id);
                setTicket(data);
            } catch (err) {
                console.error("Ticket detay alinamadi", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [id]);

    if (loading) return <CircularProgress sx={{ mt: 4 }} />;

    if (!ticket) return <Typography>Ticket bulunamadi.</Typography>;

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>{ticket.title}</Typography>
                <Typography variant="body1" paragraph>{ticket.description}</Typography>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                    <Chip label={`Durum: ${ticket.status}`} color={ticket.status === "OPEN" ? "success" : "error"} />
                    <Chip label={`Oncelik: ${ticket.priority || "Bilinmiyor"}`} />
                    <Chip label={`Atanan: ${ticket.assignedTo || "Yok"}`} />
                </Box>

                <Typography variant="caption" color="text.secondary">
                    Olusturulma: {format(new Date(ticket.createdAt), "Pp")}
                </Typography>
            </Paper>
        </Container>
    );
};

export default TicketDetailPage;
