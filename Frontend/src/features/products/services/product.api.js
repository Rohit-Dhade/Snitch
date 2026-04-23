import axios from "axios";

export const productApi = axios.create({
    baseURL: "http://localhost:3000/api/product",
    withCredentials: true
})

export const createProduct = async (formData) => {
    try {
        const response = await productApi.post("/create-product", formData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAllSellerProducts = async () => {
    try {
        const response = await productApi.get("/get-product/seller");
        return response.data;
    } catch (error) {
        throw error;
    }
}