import React, { useState } from "react";
import axios from "axios";
import {
    Container,
    TextField,
    Button,
    MenuItem,
    Typography,
    Box,
    Snackbar,
    Alert,
} from "@mui/material";

const priorities = ["DÜŞÜK", "ORTA", "YÜKSEK"];
const statuses = ["AÇIK", "DEVAM EDİYOR", "TAMAMLANDI"];

const TicketForm = ({ onTicketCreated }) => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "ORTA",
        status: "AÇIK",
        assignedTo: "",
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post("http://localhost:8080/api/tickets", form)
            .then(() => {
                setOpenSnackbar(true);
                setForm({
                    title: "",
                    description: "",
                    priority: "ORTA",
                    status: "AÇIK",
                    assignedTo: "",
                });
                if (onTicketCreated) onTicketCreated();
            })
            .catch((err) => console.error(err));
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Yeni Ticket Oluştur
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Başlık"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Açıklama"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    multiline
                    rows={4}
                />
                <TextField
                    select
                    label="Öncelik"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                >
                    {priorities.map((p) => (
                        <MenuItem key={p} value={p}>
                            {p}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Durum"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                >
                    {statuses.map((s) => (
                        <MenuItem key={s} value={s}>
                            {s}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Atanan Kişi"
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleChange}
                />
                <Button type="submit" variant="contained">
                    Oluştur
                </Button>
            </Box>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                <Alert severity="success" variant="filled" onClose={() => setOpenSnackbar(false)}>
                    Ticket başarıyla oluşturuldu!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default TicketForm;