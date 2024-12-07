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
                        element: "#step2",
                        intro: "This is Step 2! You can view  your Profile here.",
                        title: "Step 2: View Profile",
                    },
                    {
                        element: "#step3",
                        intro: "This is Step 3! You can logout here.",
                        title: "Step 3: Logout",
                    },
                    {
                        element: "#step4",
                        intro: "This is Step 4! You can view your settings here.",
                        title: "Step 4: Settings",
                    },
                    {
                        element: "#step5",
                        intro: "Now you can add  notes here. and if want to delete long press on the card.", 
                        title: "Step 5: Add/delete a notes",
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
