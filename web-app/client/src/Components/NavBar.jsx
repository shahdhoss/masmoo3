import React from "react";
import "./Assets/css/tailwind.css";
import profile from "./Assets/images/profile.png";
import download from "./Assets/images/download-arrow.png";
import options from "./Assets/images/Options.png";
import Searchkit from "./NavComp/SearchKit";
import PlayBack from "./NavComp/PlayBack";
import masmoo3 from "./Assets/images/masmoo3.png";
import { Link } from "react-router-dom";

const NavBar = ({ searchWord, setSearchWord }) => {
    return (
        <div>
            <div className="flex justify-between items-center bg-gray-50 shadow-sm p-4 ps-10 space-x-3">
                <div className="shrink-0">
                    <Link to="/">
                        <img src={masmoo3} className="size-8" alt="Masmoo3 Logo" />
                    </Link>
                </div>
                <Searchkit searchWord={searchWord} setSearchWord={setSearchWord} />
                <div className="flex justify-center items-center space-x-4">
                    <PlayBack />
                    <div className="flex justify-between items-center space-x-5 pe-10 shrink-0">
                        <a href="/login">
                            <img src={download} className="size-5" alt="Download" />
                        </a>
                        <a href="/user">
                            <img src={profile} className="size-5" alt="Profile" />
                        </a>
                        <a href="/signup">
                            <img src={options} className="size-5" alt="Options" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;