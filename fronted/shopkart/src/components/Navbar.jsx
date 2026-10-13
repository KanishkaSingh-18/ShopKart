import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from "../context/CartContext"

const Navbar = () => {
    const navigate = useNavigate()
    const { setCustomer } = useAuth()

    const [wishlistCount, setWishlistCount] = useState(0)

    const { cartItems } = useCart()

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    )

    const fetchWishlistCount = async () => {
        try {
            const response = await axiosInstance.get('/wishlist')
            setWishlistCount(response.data.count)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchWishlistCount()

        const handleWishlistUpdated = (event) => {
            setWishlistCount(event.detail)
        }

        window.addEventListener(
            'wishlistUpdated',
            handleWishlistUpdated
        )

        return () => {
            window.removeEventListener(
                'wishlistUpdated',
                handleWishlistUpdated
            )
        }
    }, [])

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/customers/logout')
            setCustomer(null)
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4">

            <div className="max-w-6xl mx-auto flex items-center justify-between">

                <Link
                    to="/home"
                    className="text-xl font-bold text-gray-900"
                >
                    Product Catalogue
                </Link>

                <div className="flex items-center gap-6">

                    <Link
                        to="/home"
                        className="text-gray-600 hover:text-blue-600 transition"
                    >
                        Home
                    </Link>

                    <Link
                        to="/products"
                        className="text-gray-600 hover:text-blue-600 transition"
                    >
                        Products
                    </Link>

                    <Link
                        to="/wishlist"
                        className="relative flex items-center justify-center"
                        aria-label="Wishlist"
                    >
                        <span className="w-8 h-8 bg-white border border-red-400 rounded-full shadow-sm flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-200">

                            <svg
                                viewBox="0 0 24 24"
                                className="w-5 h-5"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
                                    fill="#ef4444"
                                    stroke="#ef4444"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                        </span>

                        {wishlistCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9.5px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    <Link
                        to="/cart"
                        className="relative flex items-center justify-center"
                        aria-label="Cart"
                    >
                        <span className="w-8 h-8 bg-white border border-gray-300 rounded-full shadow-sm flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-200">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="w-5 h-5 text-gray-700"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2 4h14M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                                />
                            </svg>

                        </span>

                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9.5px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <Link
                        to="/orders"
                        className="text-gray-600 hover:text-blue-600 transition"
                    >
                        My Orders
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-2.5 py-0.5 rounded-lg font-medium hover:bg-red-600 transition"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>
    )
}

export default Navbar