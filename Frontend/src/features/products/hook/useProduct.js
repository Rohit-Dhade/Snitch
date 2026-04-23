import { createProduct, getAllSellerProducts } from "../services/product.api.js";
import { useDispatch } from "react-redux";
import { setSellerProducts } from "../state/product.slice.js";

export const useProduct = () => {
    const dispatch = useDispatch();

    const handleCreateProduct = async (formData) => {
        try {
            const response = await createProduct(formData);
            return response;
        } catch (error) {
            throw error;
        }
    }

    const handleGetAllSellerProducts = async () => {
        try {
            const response = await getAllSellerProducts();
            dispatch(setSellerProducts(response.products));
            return response.products;
        } catch (error) {
            throw error;
        }
    }

    return {
        handleCreateProduct,
        handleGetAllSellerProducts
    }
}