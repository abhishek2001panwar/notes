import { FaPlus } from "react-icons/fa";
import Link from "next/link";

const Button = () => {
    return (
        <Link href="/components/Add">
            <button
                id="step1"
                className="fixed bottom-4 right-4 w-16 rounded-full text-2xl font-bold py-4 flex items-center justify-center transition-all duration-150 ease-in-out"
            >
                <FaPlus className="mr-2" />
            </button>
        </Link>
    );
};

export default Button;
