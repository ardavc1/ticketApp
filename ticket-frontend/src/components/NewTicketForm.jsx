import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from "@mui/material";
import { createTicket } from "../services/ticketService";

const NewTicketForm = ({ onTicketCreated, selectedType }) => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        category: "",
        assignee: "",
    });

    useEffect(() => {
        if (selectedType) {
            setForm((prev) => ({ ...prev, category: selectedType }));
        }
    }, [selectedType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newTicket = await createTicket(form);
            if (typeof onTicketCreated === "function") {
                onTicketCreated(newTicket);
            }
            alert("Talep başarıyla oluşturuldu!");
            setForm({
                title: "",
                description: "",
                priority: "MEDIUM",
                category: selectedType || "",
                assignee: "",
            });
        } catch (error) {
            console.error(error);
            alert("Talep oluşturulamadı.");
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
            py={6}
            px={2}
            bgcolor="#f9f9f9" // Hafif gri arka plan istersen; saf beyaz istiyorsan sil
            minHeight="100vh"
        >
            <Paper
                elevation={2}
                sx={{
                    p: 4,
                    width: "100%",
                    maxWidth: 600,
                    bgcolor: "#fff",
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" mb={3} fontWeight={600}>
                    Yeni Talep Oluştur
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Başlık"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Açıklama"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Öncelik</InputLabel>
                                <Select
                                    name="priority"
                                    value={form.priority}
                                    onChange={handleChange}
                                    label="Öncelik"
                                >
                                    <MenuItem value="LOW">Düşük</MenuItem>
                                    <MenuItem value="MEDIUM">Orta</MenuItem>
                                    <MenuItem value="HIGH">Yüksek</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Atanacak Kişi"
                                name="assignee"
                                value={form.assignee}
                                onChange={handleChange}
                                fullWidth
                                placeholder="kullanici@firma.com"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                            >
                                Talep Oluştur
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default NewTicketForm;
