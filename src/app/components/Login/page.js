'use client'
import React, { use, useState } from 'react';
import { Camera, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { supabase } from '@/helpers/supabase';
import { SiSimplelogin } from 'react-icons/si';
import { useRouter } from 'next/navigation';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Please enter a valid email address');
            setLoading(false);
            return;
        }
        try {
            // Login with Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setLoading(false);
                setMessage(error.message);
                return;
            }

            if (data.user) {
                setLoading(false);
                setMessage('Login successful!' , 'success');
                // Replace with actual navigation method
                window.location.href = '/components/Homepage';
            }
        } catch (error) {
            setLoading(false);
            setMessage('Something went wrong. Please try again.');
            console.error(error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-6"><SiSimplelogin className="inline-block mr-3" size={24} />
                Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium">
                            Email
                        </label>
                        <div className="flex items-center">
                            <Mail className="absolute left-3 text-gray-400" size={20} />
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium">
                            Password
                        </label>
                        <div className="flex items-center">
                            <Lock className="absolute left-3 text-gray-400" size={20} />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 text-gray-400 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className=" border  text-green-600 px-4 py-2 rounded-md">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <div className="text-center mt-4">
                        <span className="text-sm text-gray-600">
                            Don&apos;t have an account?{" "}
                            <button
                                type="button"
                                
                                onClick={() => router.push("/components/Signup")}
                                className="text-blue-500 hover:underline focus:outline-none"
                            >
                                Sign Up
                            </button>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;