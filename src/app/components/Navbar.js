'use client';
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Menu and close icons
import { IoSettings, IoLogOut } from "react-icons/io5";
import { FaUserLarge } from "react-icons/fa6";
import { supabase } from "@/helpers/supabase";
import TourGuide from "./Tourguide";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile toggle state
  const [startTour, setStartTour] = useState(false);
  const [userData, setUserData] = useState(null); // User data state
  const [notes, setNotes] = useState([]); // State to store notes
  const router = useRouter();

  useEffect(() => {
    // Check if the tour has been shown before
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      setStartTour(true);
      localStorage.setItem("hasSeenTour", "true");
    }
  }, []);

  useEffect(() => {
    // Fetch current session user data from Supabase
    const fetchUserData = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionData?.session) {
        const user = sessionData.session.user;

        const { data: notes, error: notesError } = await supabase
          .from("user") // Assuming 'users' table stores user data
          .select("*")
          .eq("uid", user.id);

        setUserData({
          name: user.email.charAt(0).toUpperCase(),
          email: user.email,

        });


      } else if (sessionError) {
        console.error("Error fetching session:", sessionError.message);
      }
    };
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

    fetchUserData();
  }, []);


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error logging out:", error.message);
    router.push("/components/Login");
  };

  return (
    <nav className="flex justify-between md:px-16 items-center p-10 dark:bg-gray-200">
      {/* Left: App Name */}
      <div className="text-xl font-bold text-gray-900 dark:text-white ">NotesApp</div>

      {/* Right: Icons and Mobile Menu */}
      <div className="relative">
        {/* Menu Icon for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(isMenuOpen)}
            className="text-gray-900 dark:text-white focus:outline-none"
          >
            {/* {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />} */}
          </button>
        </div>

        {/* Icons */}
        <div
          className={`absolute z-[9999] md:static right-0  md:top-0 flex flex-row md:flex-row items-center md:gap-4 bg-gray-100 dark:bg-gray-800 md:bg-transparent md:dark:bg-transparent shadow-lg md:shadow-none rounded-md md:rounded-none 
            } md:flex`}
        >
          <Link
            id="step5"
            className="p-2 text-gray-900 dark:text-white hover:text-green-500"
            href="/components/Settings"
          >
            <IoSettings size={25} />
          </Link>
          <button
            onClick={handleLogout}
            id="step4"
            className="p-2 text-gray-900 dark:text-white hover:text-green-500"
          >
            <IoLogOut size={27} />
          </button>
          <div className="relative z-999">
            {/* Profile Icon */}
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              id="step3"
              className="p-2 text-gray-900 dark:text-white hover:text-green-500"
            >
              <FaUserLarge size={25} />
            </button>

            {/* Profile Box */}
            {isProfileOpen && userData && (
              <div className="absolute right-0 mt-2 w-86 z-[9999] bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg rounded-md p-6">
                {/* User's Name Initial in Big Circle */}
                <div className="flex flex-col items-center space-y-4">
                  {/* Circle */}
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-500 text-white font-bold text-3xl">
                    {userData.name.charAt(0).toUpperCase()}
                  </div>

                  {/* User Email */}
                  <div className="text-center">
                    <p className="font-medium text-lg">{userData.email}</p>
                  </div>

                  {/* Total Notes */}
                  <div className="text-center">
                    <p className="text-md text-gray-500 dark:text-gray-300">
                      Total Notes: <span className="font-bold">{notes.length}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}


          </div>
        
        </div>
      </div>
      <TourGuide startTour={startTour} />
    </nav>
  );
}
