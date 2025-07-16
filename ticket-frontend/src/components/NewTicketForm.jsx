import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    MenuItem,
    Typography,
    Paper,
    Stack,
} from "@mui/material";
import axios from "axios";
import {createTicket, uploadTicketFile} from "../services/ticketService";

const priorities = ["Düşük", "Orta", "Yüksek"];

const priorityMap = {
    Düşük: "LOW",
    Orta: "MEDIUM",
    Yüksek: "HIGH",
};

const NewTicketForm = ({ selectedType, onTicketCreated }) => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "Orta",
        category: selectedType || "",
        status: "OPEN"
    });

    const [file, setFile] = useState(null);

    useEffect(() => {
        if (selectedType) {
            setForm((prev) => ({ ...prev, category: selectedType }));
        }
    }, [selectedType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            priority: priorityMap[form.priority] || "MEDIUM",
        };

        try {
            const newTicket = await createTicket(payload);

            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("ticketId", newTicket.id);
                await uploadTicketFile(file, newTicket.id);
            }

            if (onTicketCreated) {
                onTicketCreated(newTicket);
            }

            alert("Talep başarıyla oluşturuldu!");
            setForm({
                title: "",
                description: "",
                priority: "Orta",
                category: selectedType || "",
                status: "OPEN"
            });
            setFile(null);
        } catch (error) {
            console.error("Talep gönderilirken hata:", error);
            alert("Talep oluşturulamadı.");
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            justifyContent="center"
            mt={4}
            px={2}
        >
            <Paper
                elevation={4}
                sx={{
                    width: "100%",
                    maxWidth: 500,
                    p: 4,
                    borderRadius: 3,
                    backgroundColor: "#fff",
                }}
            >
                <Typography variant="h6" mb={3} fontWeight="bold">
                    Yeni Talep Formu
                </Typography>

                <Stack spacing={3}>
                    <TextField
                        label="Kategori"
                        value={form.category}
                        fullWidth
                        disabled
                    />

                    <TextField
                        name="title"
                        label="Başlık *"
                        value={form.title}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        name="description"
                        label="Açıklama *"
                        value={form.description}
                        onChange={handleChange}
                        required
                        fullWidth
                        multiline
                        rows={4}
                    />

                    <TextField
                        name="priority"
                        label="Öncelik"
                        select
                        value={form.priority}
                        onChange={handleChange}
                        fullWidth
                    >
                        {priorities.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button variant="outlined" component="label">
                        {file ? `Dosya: ${file.name}` : "Dosya Ekle"}
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>

                    <Button type="submit" variant="contained" fullWidth size="large">
                        Talep Oluştur
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default NewTicketForm;
