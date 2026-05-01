import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/cart';

const cartApi = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

export const addToCartApi = async (productId, variant, quantity, price, size) => {
    const response = await cartApi.post(`/add/${productId}`, { variant, quantity, price, size });
    return response.data;
};

export const viewCartApi = async () => {
    const response = await cartApi.get('/view');
    return response.data;
};

// export const removeFromCartApi = async (itemId) => {
//     const response = await cartApi.delete(`/remove/${itemId}`);
//     return response.data;
// };

// export const updateQuantityApi = async (itemId, quantity) => {
//     const response = await cartApi.put(`/update/${itemId}`, { quantity });
//     return response.data;
// };
