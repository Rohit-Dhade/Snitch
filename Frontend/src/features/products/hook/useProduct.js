import { createProduct, getAllSellerProducts, getAllProducts } from "../services/product.api.js";
import { useDispatch } from "react-redux";
import { setSellerProducts, setProducts } from "../state/product.slice.js";
import { useSelector } from "react-redux";

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

    const handleGetAllProducts = async () => {
        try {
            const response = await getAllProducts();
            dispatch(setProducts(response.products));
            return response.products;
        } catch (error) {
            throw error;
        }
    }

    return {
        handleCreateProduct,
        handleGetAllSellerProducts,
        handleGetAllProducts
    }
}