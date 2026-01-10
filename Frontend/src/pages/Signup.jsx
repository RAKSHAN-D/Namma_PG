import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { User, Mail, Lock, Loader2 } from "lucide-react";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("pg_user"); // Default role
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await AuthService.register(username, email, password, role);
            setSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            console.error("Signup error:", err);
            const resMessage =
                (err.response &&
                    err.response.data &&
                    err.response.data.message) ||
                err.message ||
                err.toString();
            setError(resMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                            Namma PG
                        </h1>
                        <p className="text-gray-500">Create your account</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 text-sm rounded">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-5">

                        {/* Role Selection */}
                        <div className="flex justify-center space-x-4 mb-4">
                            <label className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-all border ${role === 'pg_user' ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="pg_user"
                                    checked={role === "pg_user"}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                />
                                <span className={`font-medium ${role === 'pg_user' ? 'text-indigo-700' : 'text-gray-600'}`}>PG User</span>
                            </label>

                            <label className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-all border ${role === 'pg_owner' ? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="pg_owner"
                                    checked={role === "pg_owner"}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="text-purple-600 focus:ring-purple-500 h-4 w-4"
                                />
                                <span className={`font-medium ${role === 'pg_owner' ? 'text-purple-700' : 'text-gray-600'}`}>PG Owner</span>
                            </label>
                        </div>

                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-gray-500">
                        <p>
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
