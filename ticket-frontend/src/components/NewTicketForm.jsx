import React, { useState } from "react";
import { TextField, Button, MenuItem, Paper, Typography, Box } from "@mui/material";
import { createTicket } from "../services/ticketService";

const NewTicketForm = ({ onTicketCreated }) => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newTicket = await createTicket(form);
            if (typeof onTicketCreated === "function") {
                onTicketCreated(newTicket);
            }
            alert("Talep başarıyla oluşturuldu!");
            setForm({ title: "", description: "", priority: "MEDIUM" });
        } catch (error) {
            console.error(error);
            alert("Talep oluşturulamadı.");
        }
    };

    return (
        <Paper elevation={3} style={{ padding: 24, marginBottom: 24 }}>
            <Typography variant="h6" gutterBottom>
                Yeni Talep Oluştur
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    label="Başlık"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Açıklama"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    required
                />
                <TextField
                    select
                    label="Öncelik"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="LOW">Düşük</MenuItem>
                    <MenuItem value="MEDIUM">Orta</MenuItem>
                    <MenuItem value="HIGH">Yüksek</MenuItem>
                </TextField>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Talep Oluştur
                </Button>
            </Box>
        </Paper>
    );
};

export default NewTicketForm;
