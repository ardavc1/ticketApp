// src/pages/TicketListPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getMyTickets } from "../services/ticketService";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // ✅ Navbar import edildi

const TicketListPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "title", headerName: "Başlık", flex: 1 },
        { field: "description", headerName: "Açıklama", flex: 2 },
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
        },
        {
            field: "actions",
            headerName: "İşlem",
            width: 100,
            renderCell: (params) => (
                <button
                    onClick={() => navigate(`/tickets/${params.row.id}`)}
                    style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        cursor: "pointer"
                    }}
                >
                    Detay
                </button>
            )
        }
    ];

    return (
        <>
            <Navbar /> {/* ✅ Navbar eklendi */}
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Taleplerim
                </Typography>
                <div style={{ height: 500, width: "100%" }}>
                    <DataGrid
                        rows={tickets}
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

export default TicketListPage;
