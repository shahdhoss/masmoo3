import { useEffect, useState } from "react";
import "./Assets/css/tailwind.css";
import FilterBar from "./SearchComp/FilterBar";
import SearchCard from "./SearchComp/SearchCard"
import axios from "axios";
import { useParams } from "react-router-dom";

const SearchPage = () => {
    const {keyword} = useParams();
    const [audioBooks,setAudioBooks] = useState([])
    useEffect(
        ()=>{

            async function fetchAudioBooks() {
                try {
                    const response = await axios.get("https://key-gertrudis-alhusseain-8243cb58.koyeb.app/audiobook")
                    setAudioBooks(response.data)
                    console.log("fetched")
                } catch (error) {
                    console.error("Error fetching audiobooks:", error);
                }
            }
            fetchAudioBooks();
        }
        ,[]
    )
    return (
        <div className="pt-8 space-y-8">
            <FilterBar />
            <div className="flex justify-center pt-15 xl:justify-start xl:pl-15 gap-10 flex-wrap">
            {
                audioBooks.filter((audioBook) => {
                    if (keyword === undefined) return true;
                    return audioBook.title.toLowerCase().includes(keyword.toLowerCase()) ||
                        audioBook.author.toLowerCase().includes(keyword.toLowerCase());
                }).map((audioBook) => {
                    return (
                        <SearchCard
                            id={audioBook.id}
                            key={audioBook.id}
                            img={audioBook.image}
                            description={audioBook.description}
                            title={audioBook.title}
                            author={audioBook.author}
                        />
                    );
                })
            }
            </div>
        </div>

    );
};

export default SearchPage;
