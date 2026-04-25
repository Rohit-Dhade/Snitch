import { useAuth } from "../hook/useAuth.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const Protected = ({ children, role = "buyer" }) => {
    const { user } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.auth);

    if (loading) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950">
                {/* Ambient glow */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[100px]" />
                </div>

                <div className="relative flex flex-col items-center gap-6">
                    {/* Spinner ring */}
                    <div className="relative flex h-16 w-16 items-center justify-center">
                        {/* Outer spinning ring */}
                        <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
                        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-zinc-400 [animation-duration:900ms]" />

                        {/* Inner icon */}
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800 shadow-lg">
                            <svg
                                className="h-4 w-4 text-zinc-300"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Text */}
                    <div className="flex flex-col items-center gap-1.5">
                        <p className="text-[15px] font-semibold tracking-tight text-zinc-200">
                            Loading
                        </p>
                        {/* Animated dots */}
                        <div className="flex items-center gap-1">
                            <span className="h-1 w-1 animate-bounce rounded-full bg-zinc-500 [animation-delay:0ms]" />
                            <span className="h-1 w-1 animate-bounce rounded-full bg-zinc-500 [animation-delay:150ms]" />
                            <span className="h-1 w-1 animate-bounce rounded-full bg-zinc-500 [animation-delay:300ms]" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    if (user.role !== role) {
        return <Navigate to="/" />
    }

    return children;
};

export default Protected;