import "../Assets/css/tailwind.css";
import { useState } from "react";
import bookmark from "../Assets/images/bookmark.png";

const SearchCard = () => {
    const imgUrl = "https://dn720701.ca.archive.org/0/items/divine_comedy_librivox/The_Divine_Comedy_1005.jpg";
    const [img, setImg] = useState(imgUrl);

    return (
        <div className="border-2 border-green-site flex justify-center items-center p-4  rounded-lg w-80 h-64 space-x-4 bg-gray-50 shadow-lg">
            <div className="relative h-56 bg-gray-900 w-32">
                {/* Bookmark Image */}
                <img src={bookmark} alt="Bookmark" className="absolute top-0 right-0 w-8 h-8" />
                {/* Book Cover Image */}
                <img src={img} alt="Book Cover" className="h-48 object-scale-down" />
            </div>
            <div className=" w-1/2 flex flex-col justify-center items-start p-4">
                <h2 className="text-xl font-semibold mt-2">Book Title</h2>
                <p className="text-gray-600">Author Name</p>
                <div className="text-gray-500 mt-2 text-sm overflow-y-scroll max-h-32">
                    This is a sample description of the book. It provides a brief overview of the content and themes.
                </div>
            </div>
        </div>
    );
};

export default SearchCard;