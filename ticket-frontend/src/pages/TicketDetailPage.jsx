import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Paper,
    CircularProgress,
    Button,
    Stack,
} from "@mui/material";
import {getTicketById, toggleTicketStatus, updateTicket} from "../services/ticketService";

const TicketDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTicket = async () => {
        try {
            const data = await getTicketById(id);
            setTicket(data);
        } catch (err) {
            console.error("Ticket alınamadı", err);
        } finally {
            setLoading(false);
        }
    };
    const handleToggleStatus = async () => {
        try {
            const updatedStatus = ticket.status === "OPEN" ? "CLOSED" : "OPEN";
            const updated = await updateTicket(ticket.id, {
                ...ticket,
                status: updatedStatus,
            });
            setTicket(updated);
        } catch (err) {
            alert("Durum değiştirilemedi.");
        }
    };

    useEffect(() => {
        fetchTicket();
    }, [id]);

    if (loading) return <CircularProgress />;

    if (!ticket)
        return (
            <Typography color="error" variant="h6">
                Ticket bulunamadı.
            </Typography>
        );

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: "24px", marginTop: "32px" }}>
                <Typography variant="h4" gutterBottom>
                    {ticket.title}
                </Typography>
                <Typography variant="body1" paragraph>
                    {ticket.description}
                </Typography>

                <Typography variant="body2">
                    <strong>Durum:</strong> {ticket.status}
                </Typography>
                <Typography variant="body2">
                    <strong>Öncelik:</strong> {ticket.priority}
                </Typography>
                <Typography variant="body2">
                    <strong>Atanan:</strong> {ticket.assignedTo || "Belirtilmedi"}
                </Typography>
                <Typography variant="body2">
                    <strong>Oluşturulma Tarihi:</strong>{" "}
                    {new Date(ticket.createdAt).toLocaleString()}
                </Typography>

                <Stack direction="row" spacing={2} mt={4}>
                    <Button
                        variant="contained"
                        color={ticket.status === "OPEN" ? "error" : "success"}
                        onClick={handleToggleStatus}
                    >
                        {ticket.status === "OPEN" ? "Kapalı Yap" : "Açık Yap"}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => navigate("/tickets")}
                    >
                        Geri Dön
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
};

export default TicketDetailPage;
