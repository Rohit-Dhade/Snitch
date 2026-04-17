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
        throw err;
    }
}