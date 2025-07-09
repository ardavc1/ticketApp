import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Card,
    CardContent,
    List,
    CircularProgress,
    Divider,
} from "@mui/material";

const TicketList = ({ refresh }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:8080/api/tickets")
            .then((res) => {
                setTickets(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Veri çekme hatası:", err);
                setLoading(false);
            });
    }, [refresh]); // refresh her değiştiğinde yeniden fetch et

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Ticket Listesi
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : tickets.length === 0 ? (
                <Typography>Henüz ticket bulunmuyor.</Typography>
            ) : (
                <List>
                    {tickets.map((ticket) => (
                        <Card key={ticket.id} variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{ticket.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {ticket.description}
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="caption">Durum: {ticket.status}</Typography><br />
                                <Typography variant="caption">Öncelik: {ticket.priority}</Typography><br />
                                <Typography variant="caption">Atanan: {ticket.assignedTo}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default TicketList;