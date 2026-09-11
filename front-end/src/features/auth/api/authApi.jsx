import api from "../../../api/axios";

export const loginUser = async (email, password) => {
    return await api.post("/auth/login", {
        email,
        password
    });
};

export const refreshToken = async () => {
    return await api.post("/auth/refresh");
};

export const logoutUser = async () => {
    return await api.post("/auth/logout");
};