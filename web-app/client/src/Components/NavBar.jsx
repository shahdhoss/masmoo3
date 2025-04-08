import React from "react";
import "./Assets/css/tailwind.css"
import profile from "./Assets/images/profile.png"
import download from "./Assets/images/download-arrow.png"
import options from "./Assets/images/Options.png"
import Searchkit from "./Assets/NavComp/SearchKit";
import PlayBack from "./Assets/NavComp/PlayBack";
const NavBar = () => {
    return(
    <div>
        <div className="flex justify-between items-center bg-gray-50 shadow-sm p-4 text-white ps-10">
            <div className="text-lg font-bold">MyApp</div>
            <PlayBack/>
            <Searchkit/>
            <div className="flex jusify-between space-x-10 pe-10">
                <a href="/login"><img src={download} className="size-7"/></a>
                <a href="/user"><img  src={profile} className="size-7"/></a>
                <a href="/signup"><img  src={options} className="size-7"/></a>
            </div>
        </div>
    </div>
    )
};

export default NavBar;