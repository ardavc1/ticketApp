import axios from "axios";
import authHeader from './authHeader';


export const toggleTicketStatus = async (ticketId) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
        `http://localhost:8080/api/tickets/${ticketId}/toggle-status`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};
export const updateTicket = async (id, updatedTicket) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(`http://localhost:8080/api/tickets/${id}`, updatedTicket, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};


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
    const response = await axios.post("http://localhost:8080/api/tickets", ticketData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};


export const deleteTicket = async (id) => {
    try {
        const response = await axios.delete(`/api/tickets/${id}`, { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getLatestTickets = async (count = 5) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`http://localhost:8080/api/tickets/latest?count=${count}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getAllTickets = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:8080/api/tickets", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
export const assignTicket = async (id, assignedTo) => {
    const res = await axios.put(`http://localhost:8080/api/tickets/${id}/assign`, { assignedTo });
    return res.data;
};
export const updateTicketStatus = async (ticketId, status) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
        `http://localhost:8080/api/tickets/${ticketId}/status`,
        { status },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};


