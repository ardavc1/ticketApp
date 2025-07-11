// src/pages/TicketListPage.jsx
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
import { getMyTickets } from "../services/ticketService";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const TicketListPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const data = await getMyTickets();
                setTickets(data);
            } catch (err) {
                console.error("Veriler alınamadı", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

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
            width: 120,
            renderCell: (params) => (
                <span style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    backgroundColor: params.value === "OPEN" ? "#c8e6c9" : "#ffcdd2",
                    color: params.value === "OPEN" ? "#2e7d32" : "#c62828",
                    fontWeight: 500,
                }}>
                    {params.value === "OPEN" ? "Açık" : "Kapalı"}
                </span>
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
        }
    ];

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Taleplerim
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
                        onRowClick={(params) => navigate(`/tickets/${params.row.id}`)}
                        sx={{
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "#f5f5f5",
                                cursor: "pointer"
                            }
                        }}
                    />
                </div>
            </Container>
        </>
    );
};

export default TicketListPage;
