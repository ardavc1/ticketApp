import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Divider,
    Container,
    Chip,
    Avatar,
    Stack,
    LinearProgress,
    ToggleButtonGroup,
    ToggleButton
} from "@mui/material";
import { getMyTickets } from "../services/ticketService";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import Navbar from "../components/Navbar";

const COLORS = ["#388e3c", "#f57c00", "#d32f2f"];

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [chartType, setChartType] = useState("pie");

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const data = await getMyTickets();
                setTickets(data);
            } catch (err) {
                console.error("Ticketlar alınamadı:", err);
            }
        };
        fetchTickets();
    }, []);

    const total = tickets.length;
    const open = tickets.filter(t => t.status === "OPEN").length;
    const closed = tickets.filter(t => t.status === "CLOSED").length;

    const priorityData = [
        { name: "Düşük", value: tickets.filter(t => t.priority === "LOW").length },
        { name: "Orta", value: tickets.filter(t => t.priority === "MEDIUM").length },
        { name: "Yüksek", value: tickets.filter(t => t.priority === "HIGH").length },
    ];

    const recentTickets = tickets.slice(-5).reverse();

    const progress = total === 0 ? 0 : Math.round((closed / total) * 100);

    // Zaman bazlı analiz için örnek veri
    const ticketsByDate = tickets.reduce((acc, t) => {
        const date = new Date(t.createdAt).toLocaleDateString("tr-TR");
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const dateData = Object.entries(ticketsByDate).map(([date, count]) => ({ date, count }));

    return (
        <>
            <Navbar />
            <Box sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh", py: 4 }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" gutterBottom align="center">
                        Dashboard
                    </Typography>

                    {/* KPI Cards */}
                    <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                        {[{
                            label: "Toplam Ticket", value: total, color: "primary"
                        }, {
                            label: "Açık Ticket", value: open, color: "warning"
                        }, {
                            label: "Kapalı Ticket", value: closed, color: "success"
                        }].map((stat, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {stat.label}
                                        </Typography>
                                        <Typography variant="h4" color={stat.color}>{stat.value}</Typography>
                                        <LinearProgress value={progress} variant="determinate" sx={{ mt: 1 }} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Chart Type Toggle */}
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                        <ToggleButtonGroup
                            value={chartType}
                            exclusive
                            onChange={(e, val) => val && setChartType(val)}
                            color="primary"
                            size="small"
                        >
                            <ToggleButton value="pie">Pasta Grafik</ToggleButton>
                            <ToggleButton value="bar">Bar Grafik</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    {/* Charts and Recent Activity */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ boxShadow: 3, borderRadius: 3, p: 2, height: "100%" }}>
                                <Typography variant="h6" gutterBottom align="center">
                                    Önceliklere Göre Dağılım
                                </Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    {chartType === "pie" ? (
                                        <PieChart>
                                            <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                                {priorityData.map((_, index) => (
                                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    ) : (
                                        <BarChart data={priorityData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="value" fill="#1976d2" />
                                        </BarChart>
                                    )}
                                </ResponsiveContainer>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card sx={{ boxShadow: 3, borderRadius: 3, p: 2, height: "100%" }}>
                                <Typography variant="h6" gutterBottom align="center">
                                    Son 5 Ticket
                                </Typography>
                                <List>
                                    {recentTickets.map((ticket) => (
                                        <React.Fragment key={ticket.id}>
                                            <ListItem alignItems="flex-start">
                                                <Avatar sx={{ mr: 2 }}>{ticket.title.charAt(0).toUpperCase()}</Avatar>
                                                <ListItemText
                                                    primary={<Typography variant="subtitle1">{ticket.title}</Typography>}
                                                    secondary={
                                                        <Stack direction="row" spacing={1} mt={1}>
                                                            <Chip label={`Durum: ${ticket.status ?? "-"}`} size="small" />
                                                            <Chip label={`Öncelik: ${ticket.priority ?? "-"}`} size="small" color="primary" />
                                                        </Stack>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider />
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Card>
                        </Grid>

                        {/* Bar Chart for Date Trend */}
                        <Grid item xs={12}>
                            <Card sx={{ boxShadow: 3, borderRadius: 3, p: 2 }}>
                                <Typography variant="h6" gutterBottom align="center">
                                    Günlük Ticket Oluşturma Trendleri
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dateData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#1976d2" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default Dashboard;