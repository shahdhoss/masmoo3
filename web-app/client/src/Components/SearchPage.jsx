import "./Assets/css/tailwind.css";
import SearchCard from "./SearchComp/SearchCard";

const SearchPage = () => {
    return (
        <div className="flex justify-start p-4 space-x-10 flex-wrap space-y-12">
            <SearchCard/>
            <SearchCard/>
            <SearchCard/>
            <SearchCard/>
            <SearchCard/>
            <SearchCard/>
            <SearchCard/>
        </div>
    );
};

export default SearchPage;