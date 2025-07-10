import React from "react";
import { Card, CardContent, Typography, Chip, Stack } from "@mui/material";

const TicketCard = ({ ticket }) => {
    return (
        <Card sx={{ mb: 2, p: 2 }}>
            <CardContent>
                <Typography variant="h6">{ticket.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {ticket.description}
                </Typography>
                <Stack direction="row" spacing={2} mt={1}>
                    <Chip label={ticket.status} color={ticket.status === "OPEN" ? "success" : "default"} />
                    <Typography variant="caption">Created: {new Date(ticket.createdAt).toLocaleString()}</Typography>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default TicketCard;
