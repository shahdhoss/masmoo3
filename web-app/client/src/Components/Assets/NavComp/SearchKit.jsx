import react from 'react'
import "../css/tailwind.css"


const Searchkit = () => {
    return (
        <div className='w-128'>
            <input type="text" placeholder="Search for an AudioBook or Podcast..." className="border border-gray-300 rounded-lg p-2  w-full"/>
        </div>
    )
}

export default Searchkit;