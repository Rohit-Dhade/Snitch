import axios from "axios";

const AuthApi = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

export const registerUser = async ({ email, contact, password, fullname, isSeller }) => {
    try {
        const response = await AuthApi.post("/auth/register-user", {
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
        const response = await AuthApi.post("/auth/login-user", {
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