import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import CreateProduct from "../features/products/pages/CreateProduct.jsx";
import Protected from "../features/auth/components/protected.jsx";
import Dashboard from "../features/products/pages/Dashboard.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <h1>Welcome to the Snitch</h1>,
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/create-product",
        element: <CreateProduct />
    },
    {
        path: "/seller/dashboard",
        element: 
            <Dashboard />
        // </Protected>
    },
]);