import axios from "axios";

export const getTicketById = async (id) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`http://localhost:8080/api/tickets/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};


export const getMyTickets = async () => {
    const token = localStorage.getItem("token"); // Login sonrası token burada tutuluyor varsayımı
    const response = await axios.get("/api/tickets/my", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
export const createTicket = async (ticketData) => {
    const token = localStorage.getItem("token");
    const response = await axios.post("/api/tickets", ticketData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
