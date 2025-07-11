// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
    Box, Grid, Typography, Card, CardContent, Chip, Avatar,
    List, ListItem, ListItemText, Divider, Stack, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import {
    LineChart, Line, PieChart, Pie, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, Legend
} from "recharts";
import { getMyTickets } from "../services/ticketService";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const STATUS_COLORS = {
    OPEN: "warning",
    CLOSED: "success"
};
const PRIORITY_COLORS = {
    LOW: "#aed581",
    MEDIUM: "#64b5f6",
    HIGH: "#ef5350"
};
const CATEGORY_COLORS = {
    GENEL: "#7e57c2",
    REQUEST: "#42a5f5",
    FEEDBACK: "#66bb6a",
    ISSUE: "#ef5350",
    SECURITY: "#ab47bc",
    "BİLGİ GÜVENLİĞİ İHLALİ": "#ab47bc",
    "GERİ BİLDİRİM": "#26c6da"
};

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [chartType, setChartType] = useState("line");
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            const data = await getMyTickets();
            setTickets(data);
        };
        fetch();
    }, []);

    const total = tickets.length;
    const open = tickets.filter(t => t.status === "OPEN").length;
    const closed = tickets.filter(t => t.status === "CLOSED").length;
    const recentTickets = tickets.slice(-5).reverse();

    const priorityData = ["LOW", "MEDIUM", "HIGH"].map(p => ({
        name: p,
        value: tickets.filter(t => t.priority === p).length
    }));

    const dateData = tickets.reduce((acc, t) => {
        const d = new Date(t.createdAt).toLocaleDateString("tr-TR");
        acc[d] = (acc[d] || 0) + 1;
        return acc;
    }, {});
    const lineChartData = Object.entries(dateData).map(([date, count]) => ({ date, count }));

    const categoryData = tickets.reduce((acc, t) => {
        const cat = t.category || 'GENEL';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
    const barChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

    return (
        <>
            <Navbar />
            <Box sx={{ background: '#f4f5f7', minHeight: '100vh', py: 4, px: 3 }}>
                <Grid container spacing={3} justifyContent="center" alignItems="center" mb={3}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" fontWeight={700} color="text.primary" align="center">
                            <AnalyticsOutlinedIcon sx={{ mb: -0.5, mr: 1 }} /> Talep Takip Paneli
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                        <ToggleButtonGroup size="small" value={chartType} exclusive onChange={(e, val) => val && setChartType(val)}>
                            <ToggleButton value="line">Günlük</ToggleButton>
                            <ToggleButton value="bar">Kategori</ToggleButton>
                            <ToggleButton value="pie">Öncelik</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>

                <Grid container spacing={3} justifyContent="center" mb={4}>
                    {[{
                        label: 'Toplam Ticket', value: total, icon: <AssignmentOutlinedIcon fontSize="large" />, color: '#e3eaf3'
                    }, {
                        label: 'Açık Ticket', value: open, icon: <FiberManualRecordIcon sx={{ color: '#fbc02d' }} />, color: '#fdf5e6'
                    }, {
                        label: 'Kapalı Ticket', value: closed, icon: <CheckCircleOutlineOutlinedIcon fontSize="large" />, color: '#e0f2f1'
                    }].map((stat, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <Card sx={{ background: stat.color, borderRadius: 2 }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        {stat.icon}
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                                            <Typography variant="h5" fontWeight={600}>{stat.value}</Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Card sx={{ borderRadius: 2, p: 2, mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                        {chartType === "line" ? "📈 Günlük Oluşturulan Ticketlar" : chartType === "bar" ? "📊 Kategorilere Göre Dağılım" : "🍰 Öncelik Dağılımı"}
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        {chartType === "line" ? (
                            <LineChart data={lineChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#1565c0" strokeWidth={2} />
                            </LineChart>
                        ) : chartType === "bar" ? (
                            <BarChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value">
                                    {barChartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={CATEGORY_COLORS[entry.name.toUpperCase()] || "#5e35b1"}
                                        />
                                    ))}
                                    <LabelList dataKey="value" position="top" />
                                </Bar>
                            </BarChart>
                        ) : (
                            <PieChart>
                                <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {priorityData.map((entry, index) => (
                                        <Cell key={index} fill={PRIORITY_COLORS[entry.name]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        )}
                    </ResponsiveContainer>
                </Card>

                <Card sx={{ borderRadius: 2, p: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                        🕒 Son Ticket Aktiviteleri
                    </Typography>
                    <List>
                        {recentTickets.map((ticket) => (
                            <React.Fragment key={ticket.id}>
                                <ListItem button onClick={() => navigate(`/tickets/${ticket.id}`)} alignItems="flex-start">
                                    <Avatar sx={{ bgcolor: '#1e88e5', mr: 2 }}>{ticket.title.charAt(0).toUpperCase()}</Avatar>
                                    <ListItemText
                                        primary={<Typography variant="subtitle1" fontWeight={500}>{ticket.title}</Typography>}
                                        secondary={
                                            <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                                                <Chip label={`Durum: ${ticket.status}`} color={STATUS_COLORS[ticket.status]} size="small" />
                                                <Chip label={`Öncelik: ${ticket.priority}`} size="small" />
                                                {ticket.category && <Chip label={`Kategori: ${ticket.category}`} size="small" />}
                                                <Chip label={`Oluşturan: ${ticket.createdBy}`} size="small" />
                                                <Chip label={`Tarih: ${new Date(ticket.createdAt).toLocaleDateString('tr-TR')}`} size="small" />
                                            </Stack>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </Card>
            </Box>
        </>
    );
};

export default Dashboard;