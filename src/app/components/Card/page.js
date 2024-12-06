'use client';
import { useEffect, useState } from "react";
import { FaPlus, FaRegImages } from "react-icons/fa";
import { supabase } from "@/helpers/supabase";
import { marked } from "marked";
import Link from "next/link";
import TourGuide from "../Tourguide";
import Button from "../Botton/page";

import { MdStickyNote2 } from "react-icons/md";
export default function Card() {
    const [startTour, setStartTour] = useState(false);
    const [notes, setNotes] = useState([]); // State to store notes

    useEffect(() => {
        // Fetch notes from Supabase
        async function fetchNotes() {
            try {
                const { data, error } = await supabase
                    .from("note")
                    .select("*"); // Fetch all rows from the 'note' table

                if (error) throw error;
                setNotes(data);
            } catch (error) {
                console.error("Error fetching notes:", error.message);
            }
        }

        fetchNotes();

        // Check if the tour has been shown before
        const hasSeenTour = localStorage.getItem("hasSeenTour");

        if (!hasSeenTour) {
            setStartTour(true);
            localStorage.setItem("hasSeenTour", "true");
        }
    }, []);

    return (
        <>
            {notes.length === 0 ? (
                // Show SVG and message when there are no notes
                <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center">
                    {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-32 h-32 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m2 6H7m5-16C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                        />
                    </svg> */}
                    <MdStickyNote2 className="w-32 h-32 text-blue-500" />
                    <h2 className="mt-6 text-xl font-bold text-gray-700 dark:text-gray-300">
                        No Notes Found
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Start adding your thoughts or ideas by clicking the button below.
                    </p>
                    <Link href="/components/Add">
                        <button className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm font-light rounded-full shadow-md hover:bg-blue-600">
                            Add a Note
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-2 p-5 md:p-10">
                    {notes.map((note) => {
                        // Convert markdown to HTML only if note.content is not undefined or null
                        const htmlContent = note.note ? marked(note.note) : '';

                        return (
                            <div
                                key={note.id}
                                className="relative -z-999 mt-20  md:mt-0 max-w-xs bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-lg"
                            >
                                {/* Content */}
                                <div id="step6" className="p-4">
                                    {/* Image */}
                                    <div className="w-10 h-10 rounded-md overflow-hidden mb-2">
                                        <FaRegImages className="text-3xl" />
                                    </div>

                                    {/* Summary Data */}
                                    <div className="flex justify-between items-start mb-4 mt-5">
                                        {/* Summary Text */}
                                        <div>
                                            <p
                                                className="text-gray-900 dark:text-white text-sm min-h-[4.5rem] md:min-h-[6rem] overflow-hidden overflow-ellipsis"
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        htmlContent.split(' ').slice(0, 15).join(' ') +
                                                        `<span
                                            className="text-blue-500 cursor-pointer mt-2"
                                        >
                                            ... more
                                        </span>`, // Show first 15 words
                                                }}
                                            />

                                            <p className="text-green-500 text-sm mt-2">
                                                {new Date(note.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-12">
                                        {note.suggestedTags?.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-200 text-gray-800 text-xs font-medium shadow-sm px-3 py-1 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Full-Width Button */}
                                <Link href={`/components/Card/${note.id}`}>
                                    <button className="absolute mt-2 bottom-0 left-0 w-full bg-blue-500 text-white text-sm font-bold py-4 rounded-b-3xl">
                                        View
                                    </button>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
            <Button />
            <TourGuide startTour={startTour} />
        </>
    );
}
