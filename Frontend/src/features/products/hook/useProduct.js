import { createProduct, getAllSellerProducts, getAllProducts, getProductById, addVariant } from "../services/product.api.js";
import { useDispatch } from "react-redux";
import { setSellerProducts, setProducts } from "../state/product.slice.js";

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

    const handleGetProductById = async (id) => {
        try {
            const response = await getProductById(id);
            return response.product;
        } catch (error) {
            throw error;
        }
    }

    const handleAddVariant = async (productId, formData) => {
        try {
            const response = await addVariant(productId, formData);
            return response;
        } catch (error) {
            throw error;
        }
    }

    return {
        handleCreateProduct,
        handleGetAllSellerProducts,
        handleGetAllProducts,
        handleGetProductById,
        handleAddVariant,
    }
}