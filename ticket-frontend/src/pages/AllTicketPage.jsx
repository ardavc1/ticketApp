import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    IconButton,
    Tooltip,
    Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { DataGrid } from "@mui/x-data-grid";
import { getAllTickets, deleteTicket, updateTicketStatus } from "../services/ticketService";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const AllTicketPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [editRow, setEditRow] = useState(null);
    const [editStatus, setEditStatus] = useState("");
    const [editAssignee, setEditAssignee] = useState("");
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
        const confirm = window.confirm("Bu ticket'ı silmek istediğinizden emin misiniz?");
        if (!confirm) return;
        try {
            await deleteTicket(id);
            setTickets((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            alert("Silme işlemi başarısız oldu.");
        }
    };

    const handleEdit = (row) => {
        setEditRow(row.id);
        setEditStatus(row.status);
        setEditAssignee(row.assignedTo || "");
    };

    const handleSave = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:8080/api/tickets/${id}/assign`,
                { assignedTo: editAssignee },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await updateTicketStatus(id, editStatus);
            setTickets((prev) =>
                prev.map((t) =>
                    t.id === id ? { ...t, assignedTo: editAssignee, status: editStatus } : t
                )
            );
            setEditRow(null);
        } catch (err) {
            alert("Güncelleme başarısız oldu");
        }
    };

    const getCategoryColor = (cat) =>
        ({
            ISSUE: "#e74c3c",
            REQUEST: "#27ae60",
            SECURITY: "#f39c12",
            FEEDBACK: "#8e44ad",
        }[cat] || "#95a5a6");

    const filteredTickets =
        categoryFilter === "ALL"
            ? tickets
            : tickets.filter((t) => t.category === categoryFilter);

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "title", headerName: "Başlık", flex: 1 },
        { field: "description", headerName: "Açıklama", flex: 2 },
        {
            field: "category",
            headerName: "Kategori",
            width: 130,
            renderCell: (params) => (
                <Chip
                    label={params.value || "Bilinmiyor"}
                    style={{
                        backgroundColor: getCategoryColor(params.value) + "22",
                        color: getCategoryColor(params.value),
                        fontWeight: "bold",
                    }}
                />
            ),
        },
        {
            field: "status",
            headerName: "Durum",
            width: 130,
            renderCell: ({ row }) =>
                editRow === row.id ? (
                    <Select
                        size="small"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="OPEN">Açık</MenuItem>
                        <MenuItem value="CLOSED">Kapalı</MenuItem>
                    </Select>
                ) : (
                    <Chip
                        label={row.status === "OPEN" ? "Açık" : "Kapalı"}
                        style={{
                            backgroundColor:
                                row.status === "OPEN" ? "#c8e6c9" : "#ffcdd2",
                            color: row.status === "OPEN" ? "#2e7d32" : "#c62828",
                            fontWeight: "bold",
                        }}
                    />
                ),
        },
        {
            field: "assignedTo",
            headerName: "Atanan",
            width: 180,
            renderCell: ({ row }) =>
                editRow === row.id ? (
                    <Select
                        size="small"
                        value={editAssignee}
                        onChange={(e) => setEditAssignee(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="">—</MenuItem>
                        <MenuItem value="admin@firma.com">admin@firma.com</MenuItem>
                        <MenuItem value="support@firma.com">support@firma.com</MenuItem>
                        <MenuItem value="user@firma.com">user@firma.com</MenuItem>
                    </Select>
                ) : (
                    <Typography variant="body2">
                        {row.assignedTo || "—"}
                    </Typography>
                ),
        },
        {
            field: "createdAt",
            headerName: "Oluşturulma",
            width: 180,
            renderCell: ({ value }) =>
                new Date(value).toLocaleString("tr-TR"),
        },
        {
            field: "actions",
            headerName: "İşlemler",
            width: 150,
            renderCell: ({ row }) => (
                <Box display="flex" gap={1}>
                    {editRow === row.id ? (
                        <>
                            <Tooltip title="Kaydet">
                                <IconButton
                                    color="success"
                                    onClick={() => handleSave(row.id)}
                                >
                                    <SaveIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="İptal">
                                <IconButton
                                    color="error"
                                    onClick={() => setEditRow(null)}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    ) : (
                        <Tooltip title="Düzenle">
                            <IconButton onClick={() => handleEdit(row)}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Detay">
                        <IconButton onClick={() => navigate(`/tickets/${row.id}`)}>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                        <IconButton onClick={() => handleDelete(row.id)} color="error">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <>
            <Navbar />
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" fontWeight={600}>
                        Tüm Talepler
                    </Typography>
                    <FormControl sx={{ minWidth: 240 }}>
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
                <DataGrid
                    rows={filteredTickets}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20]}
                    autoHeight
                    loading={loading}
                    sx={{
                        backgroundColor: "#fff",
                        borderRadius: 2,
                        fontSize: 14,
                        cursor: "pointer",
                        "& .MuiDataGrid-row:hover": {
                            backgroundColor: "#f9f9f9",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f0f0f0",
                            fontWeight: "bold",
                        },
                    }}
                />
            </Container>
        </>
    );
};

export default AllTicketPage;
