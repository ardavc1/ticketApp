// components/TicketCard.jsx
import React from "react";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { format } from "date-fns";
import {useNavigate} from "react-router-dom";
import { deleteTicket } from '../services/ticketService';

const TicketCard = ({ ticket }) => {
    const navigate = useNavigate();
    const getStatusColor = (status) => {
        return status === "OPEN" ? "success" : "error";
    };

    const handleDelete = async () => {
        if (window.confirm("Bu ticket'ı silmek istediğinizden emin misiniz?")) {
            try {
                await deleteTicket(ticket.id);
                onDelete(ticket.id); // parent'a haber ver
            } catch (error) {
                alert("Silme işlemi başarısız oldu.");
            }
        }
    };

    return (
        <Card
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            sx={{
                cursor: "pointer",
                marginBottom: 2,
                boxShadow: 3,
                "&:hover": { boxShadow: 6 },
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 2,
            }}
        >
            <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>{ticket.title}</Typography>
                <Typography variant="body2" color="text.secondary">{ticket.description}</Typography>
                <Typography variant="caption" color="text.secondary" mt={1} display="block">
                    Oluşturuldu: {format(new Date(ticket.createdAt), "Pp")}
                </Typography>
                <Chip
                    label={ticket.priority === "LOW" ? "Düşük" : ticket.priority === "HIGH" ? "Yüksek" : "Orta"}
                    color={
                        ticket.priority === "LOW"
                            ? "default"
                            : ticket.priority === "HIGH"
                                ? "error"
                                : "warning"
                    }
                    size="small"
                />
                <Button variant="outlined" color="error" onClick={handleDelete}>
                    Sil
                </Button>
            </CardContent>

            <Box sx={{ minWidth: 100, textAlign: "right" }}>
                <Chip
                    label={ticket.status === "OPEN" ? "Açık" : "Kapalı"}
                    color={getStatusColor(ticket.status)}
                    variant="outlined"
                    sx={{ fontWeight: "bold" }}
                />
            </Box>
        </Card>
    );
};

export default TicketCard;
