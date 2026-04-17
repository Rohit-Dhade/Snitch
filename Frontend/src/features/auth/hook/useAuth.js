import { setUser, setLoading, setError } from '../state/auth.slice.js';
import { useDispatch } from 'react-redux';
import { registerUser } from '../services/auth.api.js';

export const useAuth = () => {
    const dispatch = useDispatch();

    async function handleRegisterUser({ email, contact, password, fullname, isSeller = false }) {
        try {
            dispatch(setLoading(true));
            const response = await registerUser({ email, contact, password, fullname, isSeller });
            dispatch(setUser(response.user));
            dispatch(setLoading(false));
        } catch (err) {
            dispatch(setError(err.message));
            dispatch(setLoading(false));
        }
    }

    return { handleRegisterUser }
}
