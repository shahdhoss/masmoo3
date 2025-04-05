import "./Assets/css/tailwind.css";
import FilterBar from "./SearchComp/FilterBar";
import SearchCard from "./SearchComp/SearchCard";

const SearchPage = () => {
    return (
        <div className="p-15 space-y-8">
            <FilterBar/>
            <div className="flex justify-start space-x-10 flex-wrap space-y-12 ">
                <SearchCard/>
                <SearchCard/>
                <SearchCard/>
                <SearchCard/>
                <SearchCard/>
                <SearchCard/>
                <SearchCard/>
            </div>
        </div>

    );
};

export default SearchPage;