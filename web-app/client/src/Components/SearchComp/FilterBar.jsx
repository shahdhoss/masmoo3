import "../Assets/css/tailwind.css";

const FilterBar = () => {
    return (
        <div className="flex space-x-2">
            <div className="flex  h-full w-60 items-center ps-4 pe-4 shrink-0 ">
                <div className=" w-1/2 p-2 border-1 hover:bg-orange-site text-center">Audiobook</div>
                <div className="  p-2 border-1 w-1/2 text-center hover:bg-orange-site">Podcast</div>
            </div>
            <div className="flex h-full space-x-5 shrink-0">
                <div className=" w-20 h-8 pt-1.5 border-1 rounded-4xl  text-center">English</div>
                <div className=" w-20 h-8 pt-1.5 border-1 rounded-4xl  text-center">English</div>
                <div className=" w-20 h-8 pt-1.5 border-1 rounded-4xl  text-center">English</div>
                <div className=" w-20 h-8 pt-1.5 border-1 rounded-4xl  text-center">English</div>
                <div className=" w-20 h-8 pt-1.5 border-1 rounded-4xl  text-center">English</div>
                <div className=" w-20 h-8 pt-1.5 border-1 rounded-4xl  text-center">English</div>
            </div>
        </div>
    );
}
export default FilterBar;