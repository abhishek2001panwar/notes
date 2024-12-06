"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Check } from 'lucide-react';
import { supabase } from "@/helpers/supabase";
import { useRouter } from "next/navigation";


function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();


    const calculatePasswordStrength = (pass) => {
        let strength = 0;
        strength += pass.length >= 8 ? 1 : 0;
        strength += /[A-Z]/.test(pass) ? 1 : 0;
        strength += /[a-z]/.test(pass) ? 1 : 0;
        strength += /[0-9]/.test(pass) ? 1 : 0;
        strength += /[!@#$%^&*()]/.test(pass) ? 1 : 0;
        return strength;
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(calculatePasswordStrength(newPassword));
    };

    const renderPasswordStrengthIndicator = () => {
        const colors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500'];
        return (
            <div className="flex space-x-1 mt-1">
                {[0, 1, 2, 3, 4].map((segment) => (
                    <div
                        key={segment}
                        className={`h-1 w-full rounded ${segment < passwordStrength
                            ? colors[Math.min(passwordStrength - 1, 2)]
                            : 'bg-gray-200'
                            }`}
                    />
                ))}
            </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordStrength < 3) {
            setMessage('Please choose a stronger password');
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            // Sign up with Supabase Auth
            const { user, error } = await supabase.auth.signUp({
                email: email,
                password: password

            });

            if (error) {
                throw error;
            }

            // Optionally, you can store additional information like the user's name in a database
            await supabase
                .from('users')
                .insert([{ name: name, email: email }]);

            setLoading(false);
            setMessage("Signup successful! Redirecting...");

            // Simulated redirect
            setTimeout(() => {
                window.location.href = "/components/Homepage"; // redirect to the homepage or wherever you need
            }, 2000);
        } catch (error) {
            setLoading(false);
            setMessage("Something went wrong. Please try again.");
            console.error(error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-zinc-900">
                    👤Signup
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4 text-black">
                    <div className="relative">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name:
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter your full name"
                        />
                        {name && <Check className="absolute right-3 top-10 text-green-500" size={20} />}
                    </div>
                    <div className="relative">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="you@example.com"
                        />
                        {email && <Check className="absolute right-3 top-10 text-green-500" size={20} />}
                    </div>
                    <div className="relative">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password:
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Create a strong password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {renderPasswordStrengthIndicator()}
                        <p className="text-xs text-gray-500 mt-3">
                            Password must be at least 8 characters with mixed case, numbers, and symbols
                        </p>
                    </div>
                    <button
                        type="submit"
                        disabled={loading || passwordStrength < 3}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
                    >
                        {loading ? "Processing..." : "Signup"}
                    </button>
                    <div className="mt-4 text-center text-gray-500">
                        Already have an account?{" "}
                        <button
                            onClick={() => router.push("/components/Login")}
                            className="text-blue-500 hover:underline focus:outline-none"
                        >
                            Login
                        </button>
                    </div>
                </form>
                {message && (
                    <p className={`mt-4 text-center ${message.includes('Successful') ? 'text-green-600' : 'text-green-600'
                        }`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default SignupPage;