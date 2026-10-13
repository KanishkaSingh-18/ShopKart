import React from 'react'
import { useState, useEffect } from 'react'
import ProductCard from "../components/ProductCard"
import SearchBar from "../components/SearchBar"
import { axiosInstance } from '../axiosCalls/axios'

const Products = () => {
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("")

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const [wishlistIds, setWishlistIds] = useState([])
    const [wishlistLoading, setWishlistLoading] = useState(true)

    useEffect(() => {

        const fetchProducts = async () => {
            try {
                setLoading(true)
                setError(false)

                const response = await axiosInstance.get("/products", {
                    params: {
                        search: search,
                        category: category
                    }
                })

                setProducts(response.data.products)

            } catch (error) {
                setError(true)

            } finally {
                setLoading(false)
            }
        }

        if (search === "") {
            fetchProducts()
            return
        }

        const timer = setTimeout(() => {
            fetchProducts()
        }, 400)

        return () => clearTimeout(timer)

    }, [search, category])

    useEffect(() => {

        const fetchWishlist = async () => {
            try {
                const response = await axiosInstance.get('/wishlist')

                setWishlistIds(
                    response.data.wishlist.map(
                        product => product._id
                    )
                )

            } catch (error) {
                console.log(error)

            } finally {
                setWishlistLoading(false)
            }
        }

        fetchWishlist()

    }, [])


    const handleSearchChange = (searchValue, categoryValue) => {
        setSearch(searchValue)
        setCategory(categoryValue)
    }


    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">

            <div className="max-w-6xl mx-auto">

                <SearchBar
                    onSearchChange={handleSearchChange}
                />

                {loading && products.length === 0 && (
                    <p className="text-center text-gray-500 py-10">
                        Loading products...
                    </p>
                )}

                {error && (
                    <p className="text-center text-red-500 py-10">
                        Something went wrong while loading products.
                    </p>
                )}

                {wishlistLoading && !loading && (
                    <p className="text-center text-gray-500 py-10">
                        Loading wishlist status...
                    </p>
                )}

                {!loading &&
                    !wishlistLoading &&
                    !error &&
                    products.length === 0 && (
                        <p className="text-center text-gray-500 py-10">
                            No products found.
                        </p>
                    )
                }

                {!wishlistLoading &&
                    products.length > 0 &&
                    !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    isWishlisted={
                                        wishlistIds.includes(product._id)
                                    }
                                />
                            ))}

                        </div>
                    )
                }

            </div>

        </div>
    )
}

export default Products