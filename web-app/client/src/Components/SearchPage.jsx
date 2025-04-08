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
                    const response = await axios.get("http://localhost:8080/audiobook")
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
        <div className="p-15 space-y-8">
            <FilterBar/>
            <div className="flex justify-start space-x-10 flex-wrap space-y-12 ">
            {
                audioBooks.filter((audioBook) => {
                    return audioBook.title.toLowerCase().includes(keyword.toLowerCase()) ||
                        audioBook.author.toLowerCase().includes(keyword.toLowerCase())
                }).map((audioBook) => {
                    return (
                        <SearchCard
                            key={audioBook.id}
                            img={audioBook.coverImage}
                            description={audioBook.description}
                            title={audioBook.title}
                            author={audioBook.author}
                        />
                    )
                })
            }
            </div>
        </div>

    );
};

export default SearchPage;