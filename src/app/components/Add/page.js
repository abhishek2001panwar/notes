'use client';
import React, { useState, useEffect } from 'react';
import {
  FaBold, FaItalic, FaHeading, FaMicrophone, FaMicrophoneSlash,
  FaListUl, FaListOl, FaLink, FaCode, FaQuoteRight, FaTable, FaImage
} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '@/helpers/supabase';
import { v4 as uuidv4 } from 'uuid';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomHeading = ({ level, children }) => {
  const headingStyles = {
    1: 'text-2xl font-bold text-gray-900 dark:text-white mb-4',
    2: 'text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3',
    3: 'text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2',
    4: 'text-xl font-medium text-gray-600 dark:text-gray-400 mb-2',
    5: 'text-lg font-medium text-gray-500 dark:text-gray-500 mb-1',
    6: 'text-base font-medium text-gray-400 dark:text-gray-600 mb-1'
  };

  const HeadingTag = `h${level}`;

  return React.createElement(
    HeadingTag,
    { className: headingStyles[level] },
    children
  );
};

const Form = () => {
  const [file, setFile] = useState(null);
  const [marks, setMarks] = useState('75');
  const [note, setNote] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [detectedFormats, setDetectedFormats] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [loading, setLoading] = useState(false);


  // Advanced Markdown detection
  useEffect(() => {
    const detectMarkdownFormats = () => {
      const formats = [];

      // Bold detection
      if (/\*\*[^\*]+\*\*|__[^_]+__/.test(note)) {
        formats.push('Bold');
      }

      // Italic detection
      if (/\*[^\*]+\*|_[^_]+_/.test(note)) {
        formats.push('Italic');
      }

      // Headings detection
      if (/^#+ .+/m.test(note)) {
        formats.push('Headings');
      }

      // Unordered List detection
      if (/^\s*[-*+] .+/m.test(note)) {
        formats.push('Unordered List');
      }

      // Ordered List detection
      if (/^\s*\d+\. .+/m.test(note)) {
        formats.push('Ordered List');
      }

      // Code block detection
      if (/```[\s\S]*?```|`[^`\n]+`/.test(note)) {
        formats.push('Code');
      }

      // Link detection
      if (/\[([^\]]+)\]\(([^\)]+)\)/.test(note)) {
        formats.push('Links');
      }

      // Blockquote detection
      if (/^> .+/m.test(note)) {
        formats.push('Blockquotes');
      }

      // Table detection
      if (/\|.+\|[\r\n]+\|[-:| ]+\|[\r\n]+\|.+\|/.test(note)) {
        formats.push('Tables');
      }
      // Enhanced Tag Generation
      const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at',
        'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about',
        'into', 'over', 'after', 'is', 'are', 'was', 'were'
      ]);

      // Extract meaningful words and potential tags
      const words = note
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(/\s+/)
        .filter(word =>
          word.length > 2 &&
          !stopWords.has(word) &&
          !/^\d+$/.test(word)
        );

      // Count word frequencies
      const wordFrequency = words.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});

      // Sort words by frequency and take top unique tags
      const frequentWords = Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([word]) => word);

      setDetectedFormats(formats);
      setSuggestedTags(frequentWords);


    };

    detectMarkdownFormats();
  }, [note]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMarks('85');
  };

  const handleSpeechToText = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';

    if (!isListening) {
      recognition.start();
      setIsListening(true);
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNote((prevNote) => `${prevNote} ${transcript}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
  };

  const addMarkdownSyntax = (syntax) => {
    setNote((prevNote) => `${prevNote}${syntax}`);
  };
  const handleSubmit = async () => {
    if (!note) {
      alert('Please add a note before submitting.');
      return;
    }

    setLoading(true); // Set loading to true before the async operation

    try {
      let imageUrl = null;
      let fileName = uuidv4();

      // Upload file to Supabase bucket if present
      if (file) {
        const { data, error: uploadError } = await supabase.storage
          .from('note-image') // Replace with your bucket name
          .upload(fileName, file);
        if (uploadError) throw uploadError;
        imageUrl = data?.path;
      }

      let url = supabase.storage.from('note-image').getPublicUrl(fileName);

      // Insert note into database
      const { data, error } = await supabase
        .from('note') // Replace with your table name
        .insert({
          note: note,
          image: url["data"]["publicUrl"],
          suggestedTags: suggestedTags,
        });

      // Handle success response
      if (error) throw error;

      toast.success("Note added successfully")
      setNote('');
      setFile(null);
      setSuggestedTags([]);
    } catch (error) {
      console.error('Error submitting note:', error.message);
      alert('Failed to submit note. Check console for details.');
    }
    finally {
      setLoading(false)
    }
  };


  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xs border-[1px]">
      {/* File Upload */}
      {/* <div className="mb-8">
        <label className="block text-gray-800 dark:text-white font-semibold mb-2">Upload File</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full px-4 py-2 text-gray-800 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600"
        />
        {file && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Selected File: {file.name}</p>
        )}
      </div> */}
      <div className="mb-8">
        <label className="block text-gray-800 dark:text-white font-semibold mb-2">
          Upload File
        </label>
        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:border-blue-500 transition">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full px-4 py-6 cursor-pointer"
          >
            <svg
              className="w-10 h-10 mb-3 text-gray-400 dark:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4 4m0 0l4-4m-4 4V4m0 12a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2H8a2 2 0 00-2 2v4z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Drag & drop or click to upload
            </span>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        {file && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Selected File: {file.name}
          </p>
        )}
      </div>


      {/* Autosuggested Marks */}
      {/* <div className="mb-8">
        <label className="block text-gray-800 dark:text-white font-semibold mb-2">Autosuggested Marks</label>
        <p className="text-xl font-bold text-green-500">{marks}</p>
      </div> */}

      {/* Detected Markdown Formats */}
      <div className="mb-8">
        <label className="block text-gray-800 dark:text-white font-light mb-2">Detected Markdown Formats</label>
        <div className="flex flex-wrap gap-2">
          {detectedFormats.length > 0 ? (
            detectedFormats.map((format, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {format}
              </span>
            ))
          ) : (
            <span className="text-gray-500">No Markdown formats detected</span>
          )}
        </div>
      </div>
      {/* Suggested Tags */}
      <div className="mb-8">
        <label className="block text-gray-800 dark:text-white font-semibold mb-2">Suggested Tags</label>
        <div className="flex flex-wrap gap-2">
          {suggestedTags.length > 0 ? (
            suggestedTags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
             {
              tag.length > 10 ? `${tag.slice(0, 10)}...` : tag
             }
              </span>
            ))
          ) : (
            <span className="text-gray-500">No tags suggested</span>
          )}
        </div>
      </div>

      {/* Markdown Note Input */}
      <div className="mb-8">
        <label className="block text-gray-800 dark:text-white font-semibold mb-2 text-sm md:text-base lg:text-lg">
          Add Note (Markdown Format)
        </label>

        {/* Scrollable icon container */}
        <div className="flex items-center space-x-2 mb-4 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => addMarkdownSyntax('**bold** ')}
            className="p-2 bg-gray-200 rounded dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex-shrink-0"
          >
            <FaBold />
          </button>
          <button
            onClick={() => addMarkdownSyntax('_italic_ ')}
            className="p-2 bg-gray-200 rounded dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex-shrink-0"
          >
            <FaItalic />
          </button>
          <button
            onClick={() => addMarkdownSyntax('# Header\n')}
            className="p-2 bg-gray-200 rounded dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex-shrink-0"
          >
            <FaHeading />
          </button>
          <button
            onClick={() => addMarkdownSyntax('- List Item\n')}
            className="p-2 bg-gray-200 rounded dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex-shrink-0"
          >
            <FaListUl />
          </button>
          <button
            onClick={() => addMarkdownSyntax('1. Ordered List Item\n')}
            className="p-2 bg-gray-200 rounded dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex-shrink-0"
          >
            <FaListOl />
          </button>
          <button
            onClick={() => addMarkdownSyntax('[Link Text](https://example.com) ')}
            className="p-2 bg-gray-200 rounded dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex-shrink-0"
          >
            <FaLink />
          </button>
          <button
            onClick={() => addMarkdownSyntax('`code` ')}
            className="p-2 bg-gray-200 rounded dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex-shrink-0"
          >
            <FaCode />
          </button>
          <button
            onClick={() => addMarkdownSyntax('> Blockquote\n')}
            className="p-2 bg-gray-200 rounded dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex-shrink-0"
          >
            <FaQuoteRight />
          </button>
          <button
            onClick={() =>
              addMarkdownSyntax('| Column 1 | Column 2 |\n|---------|----------|\n| Value 1 | Value 2 |\n')
            }
            className="p-2 bg-gray-200 rounded dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex-shrink-0"
          >
            <FaTable />
          </button>
          <button
            onClick={() => addMarkdownSyntax('![Image Alt Text](image_url) ')}
            className="p-2 bg-gray-200 rounded dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex-shrink-0"
          >
            <FaImage />
          </button>
        </div>


        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your note in Markdown format..."
          rows="6"
          className="w-full p-4 pl-12 text-sm text-gray-800 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 resize-none"
        ></textarea>
        <div className="mt-6">
          <h3 className="text-gray-800 dark:text-white font-light mb-2">Markdown Preview</h3>
          <div className="p-6 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-600">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <CustomHeading level={1} {...props} />,
                h2: ({ node, ...props }) => <CustomHeading level={2} {...props} />,
                h3: ({ node, ...props }) => <CustomHeading level={3} {...props} />,
                h4: ({ node, ...props }) => <CustomHeading level={4} {...props} />,
                h5: ({ node, ...props }) => <CustomHeading level={5} {...props} />,
                h6: ({ node, ...props }) => <CustomHeading level={6} {...props} />
              }}
            >
              {note}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Speech to Text */}
      <div className="flex items-center justify-center">
        <button
          onClick={handleSpeechToText}
          className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg"
        >
          {isListening ? (
            <>
              <FaMicrophoneSlash className="mr-2" />
              Stop Listening
            </>
          ) : (
            <>
              <FaMicrophone className="mr-2" />
              Start Speech-to-Text
            </>
          )}
        </button>

      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-4 px-6 py-3 text-white text-sm font-medium rounded-lg ${loading
          ? 'bg-green-300 cursor-not-allowed'
          : 'bg-green-500 hover:bg-green-600'
          }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </div>
        ) : (
          'Save Note'
        )}

      </button>
      <ToastContainer />
    </div>
  );
};

export default Form;