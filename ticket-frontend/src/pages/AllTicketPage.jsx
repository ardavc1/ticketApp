import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getAllTickets, deleteTicket, updateTicket, updateTicketStatus } from "../services/ticketService";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const AllTicketPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const data = await getAllTickets();
                setTickets(data);
            } catch (err) {
                console.error("Veriler alınamadı", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const handleDelete = async (id) => {
        const onay = window.confirm("Bu ticket'ı silmek istediğinizden emin misiniz?");
        if (!onay) return;

        try {
            await deleteTicket(id);
            setTickets((prev) => prev.filter(ticket => ticket.id !== id));
        } catch (err) {
            alert("Silme işlemi başarısız oldu.");
            console.error(err);
        }
    };

    const handleAssignChange = async (ticketId, newAssignee) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:8080/api/tickets/${ticketId}/assign`,
                { assignedTo: newAssignee },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setTickets(prev =>
                prev.map(t => t.id === ticketId ? { ...t, assignedTo: newAssignee } : t)
            );
        } catch (error) {
            alert("Atama işlemi başarısız oldu.");
            console.error(error);
        }
    };
    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            await updateTicketStatus(ticketId, newStatus);
            setTickets(prev => prev.map(t =>
                t.id === ticketId ? { ...t, status: newStatus } : t
            ));
        } catch (error) {
            alert("Durum güncellenemedi.");
            console.error(error);
        }
    };


    const getCategoryColor = (category) => {
        switch (category) {
            case "ISSUE": return "#e74c3c";
            case "REQUEST": return "#27ae60";
            case "SECURITY": return "#f39c12";
            case "FEEDBACK": return "#8e44ad";
            default: return "#95a5a6";
        }
    };

    const getCategoryLabel = (category) => {
        switch (category) {
            case "ISSUE": return "Sorun";
            case "REQUEST": return "Talep";
            case "SECURITY": return "Bilgi Güvenliği";
            case "FEEDBACK": return "Geri Bildirim";
            default: return "Bilinmiyor";
        }
    };

    const filteredTickets = categoryFilter === "ALL"
        ? tickets
        : tickets.filter(ticket => ticket.category === categoryFilter);

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "title", headerName: "Başlık", flex: 1 },
        { field: "description", headerName: "Açıklama", flex: 2 },
        {
            field: "category",
            headerName: "Kategori",
            width: 160,
            renderCell: (params) => (
                <span
                    style={{
                        backgroundColor: getCategoryColor(params.value) + "22",
                        color: getCategoryColor(params.value),
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontWeight: 500,
                        fontSize: "0.875rem"
                    }}
                >
                    {getCategoryLabel(params.value)}
                </span>
            )
        },
        {
            field: "status",
            headerName: "Durum",
            width: 160,
            renderCell: (params) => (
                <Select
                    value={params.value}
                    onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
                    size="small"
                >
                    <MenuItem value="OPEN">Açık</MenuItem>
                    <MenuItem value="CLOSED">Kapalı</MenuItem>
                </Select>
            )
        },

        {
            field: "priority",
            headerName: "Öncelik",
            width: 100,
            renderCell: (params) => {
                const colorMap = {
                    HIGH: "#d32f2f",
                    MEDIUM: "#f57c00",
                    LOW: "#388e3c"
                };
                const labelMap = {
                    HIGH: "Yüksek",
                    MEDIUM: "Orta",
                    LOW: "Düşük"
                };
                return (
                    <span style={{
                        padding: "4px 8px",
                        borderRadius: "12px",
                        backgroundColor: colorMap[params.value] + "33",
                        color: colorMap[params.value],
                        fontWeight: 500
                    }}>
                        {labelMap[params.value]}
                    </span>
                );
            }
        },
        {
            field: "assignedTo",
            headerName: "Atanan Kişi",
            width: 200,
            renderCell: (params) => (
                <Select
                    value={params.value || ""}
                    onChange={(e) => handleAssignChange(params.row.id, e.target.value)}
                    size="small"
                    fullWidth
                >
                    <MenuItem value="">—</MenuItem>
                    <MenuItem value="admin@firma.com">admin@firma.com</MenuItem>
                    <MenuItem value="support@firma.com">support@firma.com</MenuItem>
                    <MenuItem value="user@firma.com">user@firma.com</MenuItem>
                </Select>
            )
        },
        {
            field: "createdAt",
            headerName: "Oluşturulma",
            width: 180,
            renderCell: (params) => {
                const date = new Date(params.value);
                return isNaN(date)
                    ? "—"
                    : date.toLocaleString("tr-TR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
            }
        },
        {
            field: "actions",
            headerName: "İşlem",
            width: 100,
            renderCell: (params) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        onClick={() => navigate(`/tickets/${params.row.id}`)}
                        style={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            cursor: "pointer",
                        }}
                    >
                        Detay
                    </button>
                    <button
                        onClick={() => handleDelete(params.row.id)}
                        style={{
                            backgroundColor: "#d32f2f",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            cursor: "pointer",
                        }}
                    >
                        Sil
                    </button>
                </div>
            )
        }
    ];

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Tüm Talepler
                </Typography>

                <Box display="flex" justifyContent="flex-end" mb={2}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Kategori Filtresi</InputLabel>
                        <Select
                            value={categoryFilter}
                            label="Kategori Filtresi"
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <MenuItem value="ALL">Tüm Kategoriler</MenuItem>
                            <MenuItem value="ISSUE">Sorun</MenuItem>
                            <MenuItem value="REQUEST">Talep</MenuItem>
                            <MenuItem value="SECURITY">Bilgi Güvenliği</MenuItem>
                            <MenuItem value="FEEDBACK">Geri Bildirim</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <div style={{ height: 500, width: "100%" }}>
                    <DataGrid
                        rows={filteredTickets}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        loading={loading}
                        disableSelectionOnClick
                    />
                </div>
            </Container>
        </>
    );
};

export default AllTicketPage;
