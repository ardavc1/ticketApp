import React, { useEffect, useState } from "react";
import { Container, Typography, CircularProgress } from "@mui/material";
import TicketCard from "../components/TicketCard";
import { getMyTickets } from "../services/ticketService";
import NewTicketForm from "../components/NewTicketForm";

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
        try {
            const data = await getMyTickets();
            setTickets(data);
        } catch (error) {
            console.error("Ticket yüklenemedi", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleNewTicket = (newTicket) => {
        setTickets((prev) => [newTicket, ...prev]);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom mt={4}>
                Taleplerim
            </Typography>

            <NewTicketForm onTicketCreated={handleNewTicket} />

            {loading ? (
                <CircularProgress />
            ) : (
                tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
            )}
        </Container>
    );
};

export default Dashboard;
