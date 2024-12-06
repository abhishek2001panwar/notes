import { useEffect } from "react";
import introJs from "intro.js";
import "intro.js/introjs.css";

const TourGuide = ({ startTour }) => {
    useEffect(() => {
        if (startTour) {
            const intro = introJs();

            intro.setOptions({
                steps: [
                    {
                        element: "#step1",
                        intro: "This is Step 1! You can add notes here.",
                        title:  "Step 1: Here you can add notes",
                   
                    },
                  
                   
                    {
                        element: "#step3",
                        intro: "This is Step 4! You can view  your Profile here.",
                        title: "Step 3: View Profile",
                    },
                    {
                        element: "#step4",
                        intro: "This is Step 5! You can logout here.",
                        title: "Step 4: Logout",
                    },
                    {
                        element: "#step5",
                        intro: "This is Step 6! You can view your settings here.",
                        title: "Step 5: Settings",
                    },
                    {
                        element: "#step6",
                        intro: "Now you can add  notes here.", 
                        title: "Step 6: Add a notes",
                    }
                ],
                showStepNumbers: false,
                scrollToElement: true,
                exitOnOverlayClick: true,
                exitOnEsc: true,
                highlightClass: "custom-highlight", // Add custom styles
                tooltipClass: "custom-tooltip", // Optional custom tooltip styling
            });

            intro.start();
        }
    }, [startTour]);

    return null; // This component does not render anything itself
};

export default TourGuide;
