import { addToCart as addItemToCart, setItems, updateQuantity } from '../state/cart.slice.js'
import { useDispatch, useSelector } from "react-redux"
import { addToCartApi, viewCartApi, removeFromCartApi, updateQuantityApi } from '../services/cart.api.js'
import { toast } from 'react-hot-toast'

const useCart = () => {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);

    async function handleAddToCart(productId, variant, quantity, price, size) {
        try {
            const response = await addToCartApi(productId, variant, quantity, price, size);
            dispatch(addItemToCart(response.data));
            toast.success("Item added to cart");
        } catch (err) {
            console.error("Error adding item to cart:", err);
            toast.error(err.response?.data?.message || "Failed to add item to cart");
        }
    }

    async function handleViewCart() {
        try {
            const response = await viewCartApi();
            dispatch(setItems(response.data));
        } catch (err) {
            console.error("Error viewing cart:", err);
        }
    }   

    async function handleRemoveFromCart(itemId) {
        try {
            const response = await removeFromCartApi(itemId);
            dispatch(setItems(response.data));
            toast.success("Item removed from cart");
        } catch (err) {
            console.error("Error removing item from cart:", err);
            toast.error(err.response?.data?.message || "Failed to remove item from cart");
        }
    }

    async function handleUpdateQuantity(itemId, quantity) {
        try {
            if (quantity < 1) return;
            const response = await updateQuantityApi(itemId, quantity);
            dispatch(setItems(response.data));
        } catch (err) {
            console.error("Error updating quantity:", err);
            toast.error(err.response?.data?.message || "Failed to update quantity");
        }
    }

    return { cart, handleAddToCart, handleViewCart, handleRemoveFromCart, handleUpdateQuantity };
}

export default useCart;