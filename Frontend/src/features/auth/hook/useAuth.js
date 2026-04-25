import { setUser, setLoading, setError } from '../state/auth.slice.js';
import { useDispatch } from 'react-redux';
import { loginUser, registerUser, Getme } from '../services/auth.api.js';

export const useAuth = () => {
    const dispatch = useDispatch();

    async function handleRegisterUser({ email, contact, password, fullname, isSeller = false }) {
        try {
            dispatch(setError(null)); // clear any previous error
            dispatch(setLoading(true));
            const response = await registerUser({ email, contact, password, fullname, isSeller });
            dispatch(setUser(response.user));
            dispatch(setLoading(false));
            return { success: true, user: response.user };
        } catch (err) {
            dispatch(setError(err.message));
            dispatch(setLoading(false));
            return { success: false };
        }
    }

    async function handleLoginUser({ email, password }) {
        try {
            dispatch(setError(null)); // clear any previous error
            dispatch(setLoading(true));
            const response = await loginUser({ email, password });
            dispatch(setUser(response.user));
            dispatch(setLoading(false));
            return { success: true, user: response.user };
        } catch (err) {
            dispatch(setError(err.message));
            dispatch(setLoading(false));
            return { success: false };
        }
    }

    async function handleGetme() {
        try {
            dispatch(setError(null));
            dispatch(setLoading(true));
            const response = await Getme();
            dispatch(setUser(response.user));
            dispatch(setLoading(false));
            return { success: true };
        } catch (err) {
            dispatch(setError(err.message));
            dispatch(setLoading(false));
            return { success: false };
        }
    }

    return { handleRegisterUser, handleLoginUser, handleGetme }
}
