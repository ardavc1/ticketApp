import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Typography,
} from "@mui/material";

const priorities = ["Düşük", "Orta", "Yüksek"];

const NewTicketForm = () => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "Orta",
        assignee: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form gönderildi:", form);
        // gönderme işlemi buraya gelecek
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                width: "100%",
                maxWidth: 500,
                p: 4,
                borderRadius: 2,
                backdropFilter: "blur(4px)",
                backgroundColor: "rgba(255, 255, 255, 0.05)", // şeffaf arka plan
                boxShadow: "0 0 20px rgba(0,0,0,0.2)",
            }}
        >
            <Typography variant="h6" mb={2} color="white" fontWeight="bold">
                Yeni Talep Oluştur
            </Typography>

            <TextField
                name="title"
                label="Başlık *"
                fullWidth
                required
                value={form.title}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{ style: { color: "#fff" } }}
            />

            <TextField
                name="description"
                label="Açıklama *"
                fullWidth
                required
                multiline
                rows={4}
                value={form.description}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{ style: { color: "#fff" } }}
            />

            <TextField
                name="priority"
                label="Öncelik"
                select
                fullWidth
                value={form.priority}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{ style: { color: "#fff" } }}
            >
                {priorities.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                name="assignee"
                label="Atanacak Kişi"
                fullWidth
                value={form.assignee}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{ style: { color: "#fff" } }}
            />

            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2, py: 1.5 }}
            >
                TALEP OLUŞTUR
            </Button>
        </Box>
    );
};

export default NewTicketForm;
