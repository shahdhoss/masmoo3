import react from 'react'
import "../css/tailwind.css"
import icon from "../images/search.png"

const Searchkit = () => {
    return (
        <div className='w-128 flex justify relative'>
            <input 
                type="text" 
                placeholder="Search for an AudioBook or Podcast..." 
                className="border border-gray-300 rounded-lg p-2 w-full pr-10"
            />
            <img 
                src={icon} 
                alt="Search Icon" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6"
            />
        </div>
    )
}

export default Searchkit;