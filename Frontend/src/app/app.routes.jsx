import { createBrowserRouter} from "react-router";
import Register from "../features/auth/pages/Register.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <h1>Welcome to the Snitch</h1>,
    },
    {
        path: "/register",
        element: <Register />
    }
]);