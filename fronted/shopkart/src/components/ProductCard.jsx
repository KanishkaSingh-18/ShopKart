import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'
import { useCart } from '../context/CartContext'

const ProductCard = ({ product, isWishlisted = false }) => {
    const navigate = useNavigate()

    const {
        cartItems,
        addToCart,
        updateQuantity
    } = useCart()

    const [saving, setSaving] = useState(false)
    const [addingToCart, setAddingToCart] = useState(false)
    const [wishlistSaved, setWishlistSaved] = useState(isWishlisted)

    useEffect(() => {
        setWishlistSaved(isWishlisted)
    }, [isWishlisted])

    const cartItem = cartItems.find(
        item =>
            (item.product?._id || item.product)?.toString() ===
            product._id.toString()
    )

    const cartQuantity = cartItem?.quantity || 0

    const handleWishlist = async () => {
        if (saving) return

        try {
            setSaving(true)

            const response = await axiosInstance.patch(
                `/wishlist/${product._id}/toggle`
            )

            setWishlistSaved(response.data.saved)

            window.dispatchEvent(
                new CustomEvent('wishlistUpdated', {
                    detail: response.data.count
                })
            )

        } catch (error) {
            console.log(error)

        } finally {
            setSaving(false)
        }
    }

    const handleAddToCart = async () => {
        if (addingToCart || product.stock === 0) return

        try {
            setAddingToCart(true)

            await addToCart(product._id)

        } catch (error) {
            console.log(error)

        } finally {
            setAddingToCart(false)
        }
    }

    const handleIncrease = async () => {
        if (!cartItem) return

        if (cartQuantity >= product.stock) {
            return
        }

        try {
            await updateQuantity(
                product._id,
                cartQuantity + 1
            )

        } catch (error) {
            console.log(error)
        }
    }

    const handleDecrease = async () => {
        if (!cartItem) return

        if (cartQuantity <= 1) {
            return
        }

        try {
            await updateQuantity(
                product._id,
                cartQuantity - 1
            )

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">

            <div className="h-56 bg-gray-100 flex items-center justify-center p-4 relative">

                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                />

                <button
                    onClick={handleWishlist}
                    disabled={saving}
                    aria-label={
                        wishlistSaved
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                    className="absolute top-3 right-3 w-8 h-8 bg-white border border-red-400 rounded-full shadow-sm flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-200 disabled:opacity-60"
                >
                    <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
                            fill={wishlistSaved ? "#ef4444" : "white"}
                            stroke="#ef4444"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
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

                <p className="text-sm text-gray-500 mb-4">
                    {product.stock} units left
                </p>

                {!cartItem ? (

                    <button
                        onClick={handleAddToCart}
                        disabled={
                            addingToCart ||
                            product.stock === 0
                        }
                        className={`w-full py-3 rounded-xl font-medium transition mb-3 ${product.stock > 0
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {addingToCart
                            ? "Adding..."
                            : product.stock === 0
                                ? "Out of Stock"
                                : "Add to Cart"
                        }
                    </button>

                ) : (

                    <div className="w-full flex items-center justify-center gap-5 py-2.5 mb-3 border border-green-600 rounded-xl">

                        <button
                            onClick={handleDecrease}
                            disabled={cartQuantity <= 1}
                            className="w-9 h-9 rounded-lg border border-gray-300 text-xl font-semibold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            −
                        </button>

                        <span className="text-lg font-semibold text-gray-900 min-w-6 text-center">
                            {cartQuantity}
                        </span>

                        <button
                            onClick={handleIncrease}
                            disabled={
                                cartQuantity >= product.stock
                            }
                            className="w-9 h-9 rounded-lg border border-gray-300 text-xl font-semibold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            +
                        </button>

                    </div>

                )}

                <button
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
                >
                    View Details
                </button>

            </div>
        </div>
    )
}

export default ProductCard