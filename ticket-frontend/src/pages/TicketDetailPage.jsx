import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Container,
    Paper,
    Chip,
    Tabs,
    Tab,
    Button,
    TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getTicketById } from "../services/ticketService";
import { getRepliesByTicketId, postReply } from "../services/ticketService"; // reply servisleri

const priorityMap = {
    LOW: "Düşük",
    MEDIUM: "Orta",
    HIGH: "Yüksek",
};

const statusMap = {
    OPEN: "Açık",
    CLOSED: "Kapalı",
};

const getPriorityColor = (priority) => {
    switch (priority) {
        case "LOW":
            return "#4caf50";
        case "MEDIUM":
            return "#fb8c00";
        case "HIGH":
            return "#f44336";
        default:
            return "#757575";
    }
};

const TicketDetailPage = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState("");

    const isAdmin = true; // gerçek projede role-based auth üzerinden kontrol edilmeli

    const fetchTicket = async () => {
        try {
            const data = await getTicketById(id);
            setTicket(data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchReplies = async () => {
        try {
            const data = await getRepliesByTicketId(id);
            setReplies(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchTicket();
        fetchReplies();
    }, [id]);

    const handleTabChange = (_, newValue) => {
        setTabIndex(newValue);
    };

    const handleReplySubmit = async () => {
        if (!newReply.trim()) return;
        try {
            const saved = await postReply(id, newReply);
            setReplies((prev) => [...prev, saved]);
            setNewReply("");
        } catch (e) {
            console.error(e);
        }
    };

    if (!ticket) return <Container sx={{ mt: 5 }}>Yükleniyor...</Container>;

    return (
        <>
            <Navbar />
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                {/* Üst Bilgi ve Sekmeler */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                        <Typography variant="h6">
                            #{ticket.id} {ticket.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            yapan <b>{ticket.createdBy || "Kullanıcı"}</b> | Tarih:{" "}
                            {new Date(ticket.createdAt).toLocaleString("tr-TR")}
                        </Typography>
                        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mt: 2 }}>
                            <Tab label="Ayrıntılar" />
                            <Tab label="Konuşmalar" />
                            <Tab label="Geçmiş" />
                        </Tabs>
                    </Box>

                    <Chip
                        label={`Talep ${priorityMap[ticket.priority] + " SLA"}`}
                        sx={{
                            bgcolor: getPriorityColor(ticket.priority),
                            color: "white",
                            fontWeight: "bold",
                            px: 2,
                            py: 1,
                            fontSize: "0.875rem",
                        }}
                    />
                </Box>

                {/* İçerik ve Talep Bilgileri */}
                <Box display="flex" gap={3}>
                    {/* Sol Panel */}
                    <Box flex={1}>
                        <Paper sx={{ p: 3 }}>
                            {tabIndex === 0 && (
                                <>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Açıklama
                                    </Typography>
                                    <Box
                                        sx={{
                                            backgroundColor: "#f5f5f5",
                                            borderRadius: 2,
                                            p: 2,
                                            mb: 2,
                                            minHeight: 120,
                                            whiteSpace: "pre-wrap",
                                            fontSize: "1rem",
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {ticket.description || "-"}
                                    </Box>
                                </>
                            )}

                            {tabIndex === 1 && (
                                <>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Konuşmalar
                                    </Typography>

                                    <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
                                        <b>System</b> – {new Date(ticket.createdAt).toLocaleString("tr-TR")}
                                        <br />
                                        Ticket oluşturuldu.
                                    </Paper>

                                    {ticket.updatedAt && (
                                        <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
                                            <b>System</b> – {new Date(ticket.updatedAt).toLocaleString("tr-TR")}
                                            <br />
                                            Ticket güncellendi.
                                        </Paper>
                                    )}

                                    {replies.map((reply) => (
                                        <Paper key={reply.id} variant="outlined" sx={{ p: 2, mb: 1 }}>
                                            <b>{reply.author?.username || "Cevaplayan"}</b> –{" "}
                                            {new Date(reply.createdAt).toLocaleString("tr-TR")}
                                            <br />
                                            {reply.message}
                                        </Paper>
                                    ))}

                                    {isAdmin && (
                                        <Box mt={2}>
                                            <TextField
                                                fullWidth
                                                label="Cevabınız"
                                                multiline
                                                rows={3}
                                                value={newReply}
                                                onChange={(e) => setNewReply(e.target.value)}
                                            />
                                            <Button
                                                onClick={handleReplySubmit}
                                                variant="contained"
                                                sx={{ mt: 1 }}
                                            >
                                                Gönder
                                            </Button>
                                        </Box>
                                    )}
                                </>
                            )}

                            {tabIndex === 2 && (
                                <Typography variant="body2" color="text.secondary">
                                    Geçmiş bilgileri yakında burada olacak.
                                </Typography>
                            )}
                        </Paper>
                    </Box>

                    {/* Sağ Panel */}
                    <Box width={300}>
                        <Paper sx={{ p: 3, backgroundColor: "#fafafa", borderRadius: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                                Talep Bilgileri
                            </Typography>

                            <Box mb={2} display="flex" alignItems="center">
                                <Typography variant="caption" color="text.secondary">
                                    Durum
                                </Typography>
                                <Chip
                                    label={statusMap[ticket.status?.toUpperCase()] || ticket.status || "-"}
                                    size="small"
                                    sx={{
                                        ml: 1,
                                        bgcolor:
                                            ticket.status?.toUpperCase() === "OPEN"
                                                ? "#90caf9"
                                                : ticket.status?.toUpperCase() === "CLOSED"
                                                    ? "#e0e0e0"
                                                    : "#cfd8dc",
                                        color: "#000",
                                        fontWeight: "bold",
                                    }}
                                />
                            </Box>

                            <Box mb={2}>
                                <Typography variant="caption" color="text.secondary">
                                    Öncelik
                                </Typography>
                                <Typography>{priorityMap[ticket.priority] || "-"}</Typography>
                            </Box>

                            <Box mb={2}>
                                <Typography variant="caption" color="text.secondary">
                                    Atanan Kişi
                                </Typography>
                                <Typography>{ticket.assignedTo || "Belirtilmedi"}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Oluşturulma Tarihi
                                </Typography>
                                <Typography>
                                    {new Date(ticket.createdAt).toLocaleString("tr-TR")}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default TicketDetailPage;
