import React, { useState } from 'react'

const SearchBar = ({ onSearchChange }) => {
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("")

    const handleSearchChange = (value) => {
        setSearch(value)
        onSearchChange(value, category)
    }

    const handleCategoryChange = (value) => {
        setCategory(value)
        onSearchChange(search, value)
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                    🔍
                </span>

                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-800 placeholder-gray-400 shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full sm:w-56 bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-700 shadow-sm outline-none cursor-pointer transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Books">Books</option>
                <option value="Home">Home</option>
            </select>
        </div>
    )
}

export default SearchBar