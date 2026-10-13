import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'

const Wishlist = () => {
    const navigate = useNavigate()

    const [wishlist, setWishlist] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [removeError, setRemoveError] = useState('')
    const [removingId, setRemovingId] = useState(null)

    const fetchWishlist = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await axiosInstance.get('/wishlist')

            setWishlist(response.data.wishlist)
        }
        catch (error) {
            setError(
                error.response?.data?.message ||
                "We couldn't load your wishlist."
            )
        }
        finally {
            setLoading(false)
        }
    }

    const handleRemove = async (productId) => {
        try {
            setRemovingId(productId)
            setRemoveError('')

            const response = await axiosInstance.delete(
                `/wishlist/${productId}`
            )

            setWishlist((currentWishlist) =>
                currentWishlist.filter(
                    (product) => product._id !== productId
                )
            )

            window.dispatchEvent(
                new CustomEvent('wishlistUpdated', {
                    detail: response.data.count
                })
            )                                   
        }
        catch (error) {
            setRemoveError(
                error.response?.data?.message ||
                "Unable to remove product from wishlist. Please try again."
            )
        }
        finally {
            setRemovingId(null)
        }
    }

    useEffect(() => {
        fetchWishlist()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600 text-lg">
                    Loading your wishlist...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Something went wrong.
                </h2>

                <p className="text-gray-500">
                    {error}
                </p>

                <button
                    onClick={fetchWishlist}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        )
    }

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
                <div className="text-5xl">
                    ❤️
                </div>

                <h2 className="text-2xl font-semibold text-gray-800">
                    Your wishlist is empty
                </h2>

                <p className="text-gray-500">
                    Save products you love and find them here later.
                </p>

                <button
                    onClick={() => navigate('/products')}
                    className="bg-blue-600 text-white px-2 py-2 rounded-xl hover:bg-blue-700"
                >
                    Browse Products
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            <div className="max-w-7xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Wishlist
                    </h1>

                    <p className="text-gray-500 mt-2">
                        {wishlist.length} products saved
                    </p>
                </div>

                {removeError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                        {removeError}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {wishlist.map((product) => (

                        <div
                            key={product._id}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition"
                        >

                            <div className="h-56 bg-gray-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-5">

                                <p className="text-sm text-blue-600 font-medium mb-2">
                                    {product.category}
                                </p>

                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    {product.name}
                                </h2>

                                <p className="text-2xl font-bold text-gray-900 mb-2">
                                    ₹{product.price}
                                </p>

                                <p className="text-sm text-gray-500 mb-5">
                                    {product.stock} units left
                                </p>

                                <button
                                    onClick={() => navigate(`/products/${product._id}`)}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition mb-3"
                                >
                                    View Details
                                </button>

                                <button
                                    onClick={() => handleRemove(product._id)}
                                    disabled={removingId === product._id}
                                    className="w-full border border-red-500 text-red-600 py-3 rounded-xl font-medium hover:bg-red-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {removingId === product._id
                                        ? 'Removing...'
                                        : 'Remove from Wishlist'
                                    }
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    )
}

export default Wishlist