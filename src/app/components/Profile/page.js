'use client'
import React, { useState } from "react";
import { FaBookmark, FaRegBookmark, FaRegImages } from "react-icons/fa";
import { BsArrowUpRightCircle } from "react-icons/bs";


const ProfilePage = () => {

    const [isBookmarked, setIsBookmarked] = useState(false);
    const user = {
        name: "Abhishek",
        email: "abhishek@example.com",
        notes: [
            { id: 1, title: "Note 1", snippet: "This is a short snippet..." },
            { id: 2, title: "Note 2", snippet: "Another snippet here..." },
        ],
    };

    return (
        <div className="bg-gradient-to-br  min-h-screen flex flex-col items-center p-6">
            {/* Header */}
            <div className="text-center  mb-6">
                <div className="w-24 h-24 bg-zinc-200 border-2 border-zinc-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-black font-bold">A</span>
                </div>
                <h1 className="text-3xl font-semibold text-gray-800">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mb-8">
                <div className="bg-white border-2 border-zinc-200  shadow-lg p-4 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-green-600">{user.notes.length}</h2>
                    <p className="text-gray-500">Notes Added</p>
                </div>
                <div className="bg-white border-2 border-zinc-200 shadow-lg p-4 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-green-600">5</h2>
                    <p className="text-gray-500">Bookmarked</p>
                </div>
            </div>

            {/* Notes Section */}
            <div className="w-full">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Your Notes</h3>
                <div className="flex flex-wrap gap-5">
                    {user.notes.map((note) => (
                        <div
                            key={note.id}
                            className="relative w-full sm:w-[48%] lg:w-[20%] bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-lg flex flex-col justify-between"
                        >
                            {/* Content */}
                            <div id="step2" className="p-4">
                                {/* Image */}
                                <div className="w-10 h-10 rounded-md overflow-hidden mb-2">
                                    <FaRegImages className="text-3xl" />
                                </div>

                                {/* Summary Data */}
                                <div className="flex flex-col mb-4 mt-5">
                                    {/* Summary Text */}
                                    <p className="text-gray-900 dark:text-white text-sm min-h-[4.5rem] md:min-h-[6rem] overflow-hidden overflow-ellipsis">
                                        {note.content || "No content available"}
                                    </p>

                                    <p className="text-green-500 text-sm mt-2">
                                        {new Date().toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {note.suggestedTags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Bookmark & View Button */}
                            <div className="flex items-center justify-between p-4 border-t border-gray-200">
                                <button
                                    className="text-gray-600 dark:text-gray-400 text-lg"
                                    onClick={() => toggleBookmark(note.id)}
                                    aria-label="Bookmark"
                                >
                                    {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                                </button>
                                <BsArrowUpRightCircle className="text-xl" />

                                {/* <button className="bg-blue-500 text-white text-sm font-light px-4 py-2 rounded-lg">
                                    View
                                </button> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Edit Profile Button */}
            <button className="mt-8 px-6 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition">
                Edit Profile
            </button>
        </div>
    );
};

export default ProfilePage;
