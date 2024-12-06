'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/helpers/supabase'
import { marked } from 'marked'
import Image from 'next/image'


const Page = () => {
    const { id } = useParams() // Get note ID from URL
    const [note, setNote] = useState(null) // State to store fetched note
    const [htmlContent, setHtmlContent] = useState('') // State to store HTML content
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch note by ID
        async function fetchNote() {
            try {
                const { data, error } = await supabase
                    .from('note') // Table name
                    .select('*') // Select all columns
                    .eq('id', id) // Filter by ID
                    .single() // Since we're fetching a single note
                
                if (error) throw error

                // Convert Markdown content to HTML
                const content = marked(data.note) // Convert markdown to HTML
                setNote(data)
                setHtmlContent(content) // Set the HTML content
            } catch (error) {
                console.error('Error fetching note:', error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchNote()
    }, [id])

    if (loading) return <p>Loading...</p>

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-3xl font-bold text-center mb-5">Note Details</h1>
            <div className="bg-white p-5 border-2 border-zinc-200  rounded-lg shadow-xs dark:bg-gray-800 dark:text-white">
                <h2 className="text-2xl font-semibold mb-3">{note?.title}</h2>
                {/* Render the content as HTML */}
                 {/* Image Section */}
                 {note?.image && (
                    <div className="mb-5 flex items-center justify-center">
                        <Image
                            src={note.image} // Image URL from the note (make sure it's a valid URL)
                            alt="Note Image"
                            width={600} // Set image width
                            height={600} // Set image height
                            className=" object-cover rounded-lg" // Styling to make the image responsive and fit well
                        />
                    </div>
                )}
                <div
                    className="note-content text-sm leading-relaxed text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
                <p className="text-gray-500 text-xs mt-5">
                    Last updated: {new Date(note?.created_at).toLocaleDateString()}
                </p>
                {note?.suggestedTags && note.suggestedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5 mt-5">
                        {note.suggestedTags.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-blue-200 text-blue-800 text-xs font-medium shadow-sm px-3 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Page
