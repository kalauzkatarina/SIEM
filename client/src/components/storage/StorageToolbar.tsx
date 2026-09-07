import { useState } from "react";
import DropDownMenu from "../events/DropDownMenu";
import { StorageToolBarProps } from "../../types/props/storage/StorageToolBarProps";


export default function StorageToolBar({ onSearch, onSort, onReset }: StorageToolBarProps) {
    const [searchText, setSearchText] = useState("");

    const handleSearch = () => {
        onSearch(searchText.trim());
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleReset = () => {
        setSearchText("");
        onReset();
    };

    return (
        <div className="grid grid-cols-3 lg:grid-cols-2  w-full px-2! py-2! mb-6">

            <div className="col-span-2 lg:col-span-1 flex jusitfy-end">
                <div className="flex gap-3 w-full lg:w-auto">

                    <input
                        type="text"
                        placeholder="Search by file name..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-3! py-2! rounded-[10px]! border border-[rgba(255,255,255,0.12)] bg-[rgba(0,0,0,0.3)]! text-white text-[13px] outline-none"
                    />

                    <button
                        onClick={handleSearch}
                        className="w-[90px]! sm:w-[80px] py-2! rounded-[10px]! bg-[#007a55]! hover:bg-[#9ca3af]! text-white text-[13px] font-semibold cursor-pointer"
                    >
                        Search
                    </button>

                    <DropDownMenu
                        OnSortTypeChange={(value: number) => onSort(value)}
                        sortName1="Name"
                        sortName2="Size"
                        sortName3="Date" />
                </div>
            </div>

            <div className="col-span-1 justify-end flex">
                <button 
                    onClick={handleReset}
                    className="w-[90px]! sm:w-[80px] py-2! rounded-[10px]! bg-[#313338]! hover:bg-[#9ca3af]! text-white text-[13px] font-semibold cursor-pointer"
                >Reset</button>
            </div>
        </div>
    );
} 