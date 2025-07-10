import { useState } from "react";
import { TextField, Button, Paper, Snackbar, Alert } from "@mui/material";
import { createTicket } from "../services/ticketService";

const NewTicketForm = () => {
    const [formData, setFormData] = useState({ title: "", description: "" });
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTicket(formData);
            setFormData({ title: "", description: "" });
            setSuccessOpen(true);
        } catch {
            setErrorOpen(true);
        }
    };

    return (
        <>
            <Paper sx={{ p: 3, mb: 4 }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Başlık *"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Açıklama *"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Talep Oluştur
                    </Button>
                </form>
            </Paper>

            <Snackbar open={successOpen} autoHideDuration={3000} onClose={() => setSuccessOpen(false)}>
                <Alert severity="success">Talep başarıyla oluşturuldu!</Alert>
            </Snackbar>
            <Snackbar open={errorOpen} autoHideDuration={3000} onClose={() => setErrorOpen(false)}>
                <Alert severity="error">Bir hata oluştu. Lütfen tekrar deneyin.</Alert>
            </Snackbar>
        </>
    );
};

export default NewTicketForm;
