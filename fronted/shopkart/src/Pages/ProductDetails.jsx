import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'
import { useCart } from '../context/CartContext'

const ProductDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const [addingToCart, setAddingToCart] = useState(false)

    const {
        cartItems,
        addToCart,
        updateQuantity
    } = useCart()

    const cartItem = cartItems.find(
        item =>
            (item.product?._id || item.product)?.toString() ===
            product?._id?.toString()
    )

    const cartQuantity = cartItem?.quantity || 0

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

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)
                setError(false)

                const response = await axiosInstance.get(`/products/${id}`)

                setProduct(response.data.product)

            } catch (error) {
                if (error.response?.status === 404) {
                    setProduct(null)
                } else {
                    setError(true)
                }
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">
                    Loading product...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-red-500">
                    Something went wrong while loading the product.
                </p>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500">
                    Product not found.
                </p>

                <button
                    onClick={() => navigate("/products")}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
                >
                    Back to Products
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">

            <div className="max-w-6xl mx-auto">

                <button
                    onClick={() => navigate("/products")}
                    className="text-gray-600 hover:text-blue-600 mb-8 transition"
                >
                    ← Back to Products
                </button>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                    <div className="grid grid-cols-1 md:grid-cols-2">

                        <div className="bg-gray-100 flex items-center justify-center p-8 md:p-12">
                            <div className="w-full h-80 md:h-[450px] flex items-center justify-center">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="p-8 md:p-12 flex flex-col justify-center">

                            <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide mb-3">
                                {product.category}
                            </p>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            <p className="text-3xl font-bold text-gray-900 mb-6">
                                ₹{product.price}
                            </p>

                            <div className="border-t border-gray-200 pt-6 mb-6">

                                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                    Description
                                </h2>

                                <p className="text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>

                            </div>

                            <div className="mb-8">

                                <p className="text-sm text-gray-500 mb-1">
                                    Availability
                                </p>

                                <p
                                    className={`font-semibold ${product.stock > 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {product.stock > 0
                                        ? `${product.stock} units available`
                                        : "Out of stock"
                                    }
                                </p>

                            </div>

                            {!cartItem ? (

                                <button
                                    onClick={handleAddToCart}
                                    disabled={
                                        product.stock === 0 ||
                                        addingToCart
                                    }
                                    className={`w-full py-3.5 rounded-xl font-semibold transition ${product.stock > 0
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    {addingToCart
                                        ? "Adding..."
                                        : product.stock > 0
                                            ? "Add to Cart"
                                            : "Out of Stock"
                                    }
                                </button>

                            ) : (

                                <div className="w-full flex items-center justify-center gap-6 py-3.5 border border-blue-600 rounded-xl">

                                    <button
                                        onClick={handleDecrease}
                                        disabled={cartQuantity <= 1}
                                        className="w-10 h-10 rounded-lg border border-gray-300 text-xl font-semibold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        −
                                    </button>

                                    <span className="text-xl font-semibold text-gray-900 min-w-8 text-center">
                                        {cartQuantity}
                                    </span>

                                    <button
                                        onClick={handleIncrease}
                                        disabled={cartQuantity >= product.stock}
                                        className="w-10 h-10 rounded-lg border border-gray-300 text-xl font-semibold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default ProductDetails