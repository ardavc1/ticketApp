// src/components/TicketList.jsx
import React, { useEffect, useState } from "react";
import TicketCard from "./TicketCard";
import { getMyTickets } from "../services/ticketService";
import { CircularProgress, Typography } from "@mui/material";

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const data = await getMyTickets();
                setTickets(data);
            } catch (err) {
                console.error("Ticketlar alınamadı:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <>
            {tickets.length > 0 ? (
                tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
            ) : (
                <Typography>Hiç talebiniz bulunmamaktadır.</Typography>
            )}
        </>
    );
};

export default TicketList;
