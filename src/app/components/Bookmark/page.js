'use client';
import React, { useState } from 'react';
import { FaBookmark, FaRegImages } from 'react-icons/fa';
import { BsArrowUpRightCircle } from 'react-icons/bs';

const Bookmark = () => {
  const [user, setUser] = useState({
    name: 'Abhishek',
    email: 'abhishek@example.com',
    notes: [
      { id: 1, title: 'Note 1', snippet: 'This is a short snippet...', bookmarked: false },
      { id: 2, title: 'Note 2', snippet: 'Another snippet here...', bookmarked: true },
      { id: 3, title: 'Note 3', snippet: 'Yet another snippet...', bookmarked: true },
    ],
  });

  // Filter bookmarked notes
  const bookmarkedNotes = user.notes.filter((note) => note.bookmarked);

  // Toggle bookmark state
  const toggleBookmark = (id) => {
    setUser((prevUser) => ({
      ...prevUser,
      notes: prevUser.notes.map((note) =>
        note.id === id ? { ...note, bookmarked: !note.bookmarked } : note
      ),
    }));
  };

  return (
    <div className="bg-gradient-to-br min-h-screen flex flex-col items-center p-6">
      {/* Stats */}
      <div className="flex justify-end w-full mb-8">
  <div className="bg-white border-2 border-zinc-200 shadow-lg p-4 rounded-lg text-center">
    <h2 className="text-2xl font-bold text-teal-600">
      {bookmarkedNotes.length}
    </h2>
    <p className="text-gray-500">Bookmarked</p>
  </div>
</div>


      {/* Bookmarked Notes Section */}
      <div className="w-full">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Bookmarked Notes</h3>
        <div className="flex flex-wrap gap-5">
          {bookmarkedNotes.map((note) => (
            <div
              key={note.id}
              className="relative w-full sm:w-[48%] lg:w-[20%] bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-lg flex flex-col justify-between"
            >
              {/* Content */}
              <div className="p-4">
                <div className="w-10 h-10 rounded-md overflow-hidden mb-2">
                  <FaRegImages className="text-3xl" />
                </div>
                <div className="flex flex-col mb-4 mt-5">
                  <p className="text-gray-900 dark:text-white text-sm min-h-[4.5rem] md:min-h-[6rem] overflow-hidden overflow-ellipsis">
                    {note.snippet}
                  </p>
                  <p className="text-green-500 text-sm mt-2">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <button
                  className="text-gray-600 dark:text-gray-400 text-lg"
                  onClick={() => toggleBookmark(note.id)}
                  aria-label="Bookmark"
                >
                  {note.bookmarked && <FaBookmark />}
                </button>
                <BsArrowUpRightCircle className="text-xl" />
              </div>
            </div>
          ))}
          {bookmarkedNotes.length === 0 && (
            <p className="text-gray-600 mt-8">No bookmarked notes available.</p>
          )}
        </div>
      </div>

     
    </div>
  );
};

export default Bookmark;
