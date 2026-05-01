import axios from "axios";

const AuthApi = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
});

export const registerUser = async ({ email, contact, password, fullname, isSeller }) => {
    try {
        const response = await AuthApi.post("/register-user", {
            email,
            contact,
            password,
            fullname,
            isSeller
        });
        return response.data;
    } catch (err) {
        // Prefer the JSON message from the backend response body
        const message = err.response?.data?.message ?? err.message;
        throw new Error(message);
    }
}

export const loginUser = async ({ email, password }) => {
    try {
        const response = await AuthApi.post("/login-user", {
            email,
            password
        });
        return response.data;
    } catch (err) {
        // Prefer the JSON message from the backend response body
        const message = err.response?.data?.message ?? err.message;
        throw new Error(message);
    }
}

export const Getme = async () => {
    try {
        const response = await AuthApi.get("/get-me");
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message ?? err.message;
        throw new Error(message);
    }
}

export const setRole = async (role) => {
    try {
        const response = await AuthApi.post("/set-role", { role });
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message ?? err.message;
        throw new Error(message);
    }
}