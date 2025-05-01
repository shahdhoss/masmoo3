import React, { useState } from "react";
import "./Assets/css/tailwind.css";
import profile from "./Assets/images/profile.png";
import download from "./Assets/images/download-arrow.png";
import options from "./Assets/images/Options.png";
import Searchkit from "./NavComp/SearchKit";
import PlayBack from "./NavComp/PlayBack";
import masmoo3 from "./Assets/images/masmoo3.png";
import logout from "./Assets/images/Logout.png";
import { Link } from "react-router-dom";

const NavBar = ({ searchWord, setSearchWord }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"))
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogout = ()=>{
        setToken(localStorage.removeItem("token"))
    } 

    return (
        <div>
            <div className="flex justify-between items-center bg-gray-50 shadow-sm p-4 ps-10 space-x-8 ">
                <div className="shrink-0">
                    <Link to="/">
                        <img src={masmoo3} className="size-8" alt="Masmoo3 Logo" />
                    </Link>
                </div>
                <Searchkit searchWord={searchWord} setSearchWord={setSearchWord} />
                <div className="flex justify-center items-center space-x-4">
                    <PlayBack />
                    <div className="flex justify-between items-center space-x-5 pe-10 shrink-0">
                        <a href="/offline" className="sm:block">
                            <img src={download} className="size-5" alt="Download" />
                        </a>
                        <a href="/user" className="hidden sm:block">
                            <img src={profile} className="size-5" alt="Profile" />
                        </a>
                        <a href="/login" className="hidden sm:block" onClick={handleLogout}>
                            <img src={logout} className="size-5" alt="Logout" />
                        </a>

                        <div
                            onClick={toggleMenu}
                            className="flex justify-center sm:hidden focus:outline-none"
                        >
                            <img src={options} className="size-7" alt="Options" />
                        </div>
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div className="absolute right-4 top-16 bg-white shadow-lg rounded-lg p-4 space-y-2">
                    <a href="/offline" className="block text-gray-700 hover:text-gray-900">
                        Download
                    </a>
                    <a href="/user" className="block text-gray-700 hover:text-gray-900">
                        Profile
                    </a>
                    <a href="/login" className="block text-gray-700 hover:text-gray-900">
                        Logout
                    </a>
                </div>
            )}
        </div>
    );
};

export default NavBar;