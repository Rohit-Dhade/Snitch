import { useState } from "react";
import { Link } from "react-router";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
    isSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: "#131313", fontFamily: "'Inter', sans-serif" }}>

      {/* Google Fonts - Inter */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-6"
            style={{ color: "#c9a84c" }}>
            Snitch
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-3"
            style={{ color: "#e5e2e1", letterSpacing: "-0.02em" }}>
            Create Account
          </h1>
          <p className="text-sm" style={{ color: "#99907e" }}>
            Join Snitch and get started
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl p-10" style={{ backgroundColor: "#1c1b1b" }}>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-xs font-medium tracking-[0.1em] uppercase"
                style={{ color: "#99907e" }}
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                autoComplete="name"
                required
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-sm"
                style={{
                  backgroundColor: "#2a2a2a",
                  color: "#e5e2e1",
                  border: "1px solid transparent",
                  caretColor: "#c9a84c",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid #c9a84c";
                  e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid transparent";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-medium tracking-[0.1em] uppercase"
                style={{ color: "#99907e" }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                autoComplete="email"
                required
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: "#2a2a2a",
                  color: "#e5e2e1",
                  border: "1px solid transparent",
                  caretColor: "#c9a84c",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid #c9a84c";
                  e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid transparent";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <label
                htmlFor="contactNumber"
                className="block text-xs font-medium tracking-[0.1em] uppercase"
                style={{ color: "#99907e" }}
              >
                Contact Number
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                autoComplete="tel"
                required
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: "#2a2a2a",
                  color: "#e5e2e1",
                  border: "1px solid transparent",
                  caretColor: "#c9a84c",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid #c9a84c";
                  e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid transparent";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-xs font-medium tracking-[0.1em] uppercase"
                style={{ color: "#99907e" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    backgroundColor: "#2a2a2a",
                    color: "#e5e2e1",
                    border: "1px solid transparent",
                    caretColor: "#c9a84c",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid #c9a84c";
                    e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "1px solid transparent";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: "#4d4637" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#4d4637")}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    /* Eye-off icon */
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    /* Eye icon */
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* isSeller Checkbox */}
            <div className="flex items-center gap-3 pt-1 pb-2">
              <div className="relative flex items-center">
                <input
                  id="isSeller"
                  name="isSeller"
                  type="checkbox"
                  checked={formData.isSeller}
                  onChange={handleChange}
                  className="sr-only"
                />
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={formData.isSeller}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, isSeller: !prev.isSeller }))
                  }
                  className="w-5 h-5 rounded flex items-center justify-center transition-all duration-200 flex-shrink-0"
                  style={{
                    backgroundColor: formData.isSeller ? "#c9a84c" : "#2a2a2a",
                    border: formData.isSeller
                      ? "1px solid #c9a84c"
                      : "1px solid #4d4637",
                  }}
                >
                  {formData.isSeller && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#241a00"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </div>
              <label
                htmlFor="isSeller"
                className="text-sm cursor-pointer select-none"
                style={{ color: "#d0c5b2" }}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isSeller: !prev.isSeller }))
                }
              >
                Are you a Seller?
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 mt-2"
              style={{
                background: "linear-gradient(135deg, #ffe08f 0%, #c9a84c 100%)",
                color: "#3d2e00",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Create Account
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-sm" style={{ color: "#4d4637" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium transition-colors duration-200"
            style={{ color: "#c9a84c" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e6c364")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#c9a84c")}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
