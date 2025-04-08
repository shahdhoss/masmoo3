import "../Assets/css/tailwind.css";
import { useState } from "react";
import bookmark from "../Assets/images/bookmark.png";

const SearchCard = ({img,description,title,author}) => {
    const [image,setImage] = useState(img);
    return (
        <div className="border-2 border-green-site flex justify-center items-center p-4  rounded-lg w-80 h-64 space-x-4 bg-gray-50 shadow-lg">
            <div className="relative h-56 bg-gray-900 w-32">
                <img src={bookmark} alt="Bookmark" className="absolute top-0 right-0 w-8 h-8" />
                <img src={image} alt="Book Cover" className="h-48 object-scale-down" />
            </div>
            <div className=" w-1/2 flex flex-col justify-start items-start pb-4 pe-4 ps-4 object-scale-down top-auto bottom-auto h-full">
                <h2 className="font-semibold mt-2">{title}</h2>
                <p className="text-gray-600">{author}</p>
                <div className="text-gray-500 mt-2 text-sm overflow-y-scroll h-32">
                    {description.length > 100 ? description.slice(0, 100) + "..." : description}
                </div>
            </div>
        </div>
    );
};

export default SearchCard;