import React from "react";
import TicketList from "../components/TicketList";
import Navbar from "../components/Navbar";

const MyTicketsPage = () => {
    return (
        <>
            <Navbar />
            <h2 style={{ paddingLeft: "2rem", paddingTop: "1rem" }}>Taleplerim</h2>
            <TicketList />
        </>
    );
};

export default MyTicketsPage;
