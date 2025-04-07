import "./Assets/css/tailwind.css";
import FilterBar from "./SearchComp/FilterBar";
import SearchCard from "./SearchComp/SearchCard"
import axios from "axios";

const SearchPage = () => {

    const [searchResults, setSearchResults] = useState([]);
    return (
        <div className="p-15 space-y-8">
            <FilterBar/>
            <div className="flex justify-start space-x-10 flex-wrap space-y-12 ">
            </div>
        </div>

    );
};

export default SearchPage;