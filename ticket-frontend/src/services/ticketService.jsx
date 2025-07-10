import axios from "axios";

export const getMyTickets = async () => {
    const token = localStorage.getItem("token"); // Login sonrası token burada tutuluyor varsayımı
    const response = await axios.get("/api/tickets/my", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
