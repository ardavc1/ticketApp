import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { createTicket } from "../services/ticketService";

const NewTicketForm = ({ onTicketCreated }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newTicket = await createTicket({ title, description });
            onTicketCreated(newTicket); // Parent component'e bildir
            setTitle("");
            setDescription("");
        } catch (err) {
            console.error("Ticket oluşturulamadı", err);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} mb={3}>
            <TextField
                label="Başlık"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Açıklama"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
                required
                multiline
                rows={4}
            />
            <Button type="submit" variant="contained" color="primary">
                Talep Oluştur
            </Button>
        </Box>
    );
};

export default NewTicketForm;
