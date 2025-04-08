import "../Assets/css/tailwind.css";
import icon from "../Assets/images/search.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SearchKit = () => {
    // const [searchWord, setSearchWord] = useState(""); 
    const navigate = useNavigate(); 
    const handleRedirect = (e) => {
            navigate(`/search/${e.target.value}`); 
    };

    return (
        <div className="w-128 flex justify relative">
            <input
                type="text"
                placeholder="Search for an AudioBook or Podcast..."
                className="border border-gray-300 rounded-lg p-2 w-full pr-10"
                onChange={ (e) => {handleRedirect(e)}} 
            />
            <img
                src={icon}
                alt="Search Icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer"
            />
        </div>
    );
};

export default SearchKit;