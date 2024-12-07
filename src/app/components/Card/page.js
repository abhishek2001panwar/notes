
'use client';
import { useEffect, useState } from "react";
import { FaRegImages } from "react-icons/fa";
import { supabase } from "@/helpers/supabase";
import { marked } from "marked";
import Link from "next/link";
import { MdStickyNote2, MdDelete } from "react-icons/md";
import TourGuide from "../Tourguide";
import Button from "../Botton/page";

// Function to extract text from Markdown content
function extractTextFromMarkdown(markdown) {
    const noImages = markdown.replace(/!\[[^\]]*\]\([^)]*\)/g, ""); // Remove image markdown
    return noImages.trim(); // Remove leading/trailing whitespace
}

export default function Card() {
    const [startTour, setStartTour] = useState(false);
    const [notes, setNotes] = useState([]);
    const [longPressedId, setLongPressedId] = useState(null); // To track long-pressed card ID

    useEffect(() => {
        // Fetch notes from Supabase
        async function fetchNotes() {
            try {
                const { data, error } = await supabase
                    .from("note")
                    .select("*");

                if (error) throw error;
                setNotes(data);
            } catch (error) {
                console.error("Error fetching notes:", error.message);
            }
        }

        fetchNotes();

        // Show tour guide if not shown before
        const hasSeenTour = localStorage.getItem("hasSeenTour");
        if (!hasSeenTour) {
            setStartTour(true);
            localStorage.setItem("hasSeenTour", "true");
        }
    }, []);

    // Function to delete a note
    async function deleteNote(id) {
        try {
            const { error } = await supabase
                .from("note")
                .delete()
                .eq("id", id);

            if (error) throw error;

            // Remove the deleted note from the state
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
            setLongPressedId(null); // Reset long press state
        } catch (error) {
            console.error("Error deleting note:", error.message);
        }
    }

    return (
        <>
            {notes.length === 0 ? (
                // Show "No Notes Found" message
                <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center">
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
                // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-16 lg sm:gap-10 md:gap-6 p-2 md:p-6 ">
                <div className="flex flex-wrap gap-16 justify-center  items-center" >   
                {notes.map((note) => {
                        const htmlContent = extractTextFromMarkdown(note.note);

                        return (
                            <div
                                key={note.id}
                                className="relative mt-20  max-w-2xl bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-lg"
                                style={{ width: "300px", height: "300px" }} // Custom width and height
                                onTouchStart={() =>
                                    setTimeout(() => {
                                        if (longPressedId === note.id) {
                                            setLongPressedId(null); // Hide the delete button if already shown
                                        } else {
                                            setLongPressedId(note.id); // Show the delete button
                                        }
                                    }, 400) // Set the long-pressed ID after 400ms
                                }
                                onTouchEnd={() => clearTimeout()} // Clear the timeout if touch ends early
                                onMouseDown={() =>
                                    setTimeout(() => {
                                        if (longPressedId === note.id) {
                                            setLongPressedId(null); // Hide the delete button if already shown
                                        } else {
                                            setLongPressedId(note.id); // Show the delete button
                                        }
                                    }, 400) // For mouse long press
                                }
                                onMouseUp={() => clearTimeout()} // Clear the timeout on mouse release
                            >
                                {/* Delete Icon - Toggle on Long Press */}
                                {longPressedId === note.id && (
                                    <div
                                        className="absolute top-2 right-2 cursor-pointer bg-red-500 text-white p-2 rounded-full"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering card click event
                                            deleteNote(note.id);
                                        }}
                                    >
                                        <MdDelete className="text-xl" />
                                    </div>
                                )}

                                

                                {/* Card Content */}
                                <div id="step5" className="p-4">
                                    {/* Image Placeholder */}
                                    <div className="w-10 h-10 rounded-md overflow-hidden mb-2">
                                        <FaRegImages className="text-3xl" />
                                    </div>

                                    {/* Summary Text */}
                                    <p
                                        className="text-gray-900 dark:text-white text-sm min-h-[4.5rem] md:min-h-[6rem] overflow-hidden overflow-ellipsis"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                htmlContent
                                                    .split(" ")
                                                    .slice(0, 15)
                                                    .join(" ") +
                                                `<span class="text-blue-500 cursor-pointer"> ... more</span>`, // Show first 15 words
                                        }}
                                    />

                                    {/* Creation Date */}
                                    <p className="text-green-500 text-sm mt-2">
                                        {new Date(note.created_at).toLocaleDateString()}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mt-10 md:mt-4">
                                        {note.suggestedTags?.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-200 text-gray-800 text-xs font-medium shadow-sm px-3 py-1 rounded-full"
                                            >
                                                {tag.length > 10 ? `${tag.slice(0, 10)}...` : tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Full-Width Button */}
                                <Link href={`/components/Card/${note.id}`}>
                                    <button className="absolute bottom-0 left-0 w-full bg-blue-500 text-white text-sm font-bold py-4 rounded-b-3xl">
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


