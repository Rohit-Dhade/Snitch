import { addToCart as addItemToCart, setItems } from '../state/cart.slice.js'
import { useDispatch, useSelector } from "react-redux"
import { addToCartApi, viewCartApi } from '../services/cart.api.js'
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

    return { cart, handleAddToCart, handleViewCart };
}

export default useCart;