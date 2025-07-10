// src/pages/CreateTicketPage.jsx
import React, {useState} from "react";
import Navbar from "../components/Navbar";
import NewTicketForm from "../components/NewTicketForm";


const CreateTicketPage = () => {
    const [tickets, setTickets] = useState([]);

    const handleNewTicket = (newTicket) => {
        setTickets((prev) => [newTicket, ...prev]);
    };


    return (
        <>
            <Navbar />
            <NewTicketForm onTicketCreated={handleNewTicket} />
        </>
    );
};

export default CreateTicketPage;
