import React from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"

const Cart = () => {
    const navigate = useNavigate()

    const {
        cartItems,
        loading,
        error,
        updateQuantity,
        removeFromCart,
        refreshCart
    } = useCart()

    const handleIncrease = async (item) => {
        if (item.quantity >= item.product.stock) {
            return
        }

        try {
            await updateQuantity(
                item.product._id,
                item.quantity + 1
            )
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleDecrease = async (item) => {
        if (item.quantity <= 1) {
            return
        }

        try {
            await updateQuantity(
                item.product._id,
                item.quantity - 1
            )
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleRemove = async (productId) => {
        try {
            await removeFromCart(productId)
        }
        catch (error) {
            console.log(error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">
                    Loading your cart...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">
                    Unable to load your cart.
                </p>

                <button
                    type="button"
                    onClick={() => refreshCart()}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
                >
                    Try Again
                </button>
            </div>
        )
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-6">
                <div className="text-5xl mb-4">
                    🛒
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Your cart is empty
                </h1>

                <p className="text-gray-500 mb-6">
                    Looks like you haven't added anything yet.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
                >
                    Browse Products
                </button>
            </div>
        )
    }

    const totalUnits = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    )

    const subtotal = cartItems.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    )

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    My Cart
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-4">

                        {cartItems.map((item) => (
                            <div
                                key={item.product._id}
                                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5"
                            >
                                <div className="flex flex-col sm:flex-row gap-5">

                                    <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center p-3 shrink-0">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    <div className="flex-1">

                                        <p className="text-sm text-blue-600 font-medium mb-1">
                                            {item.product.category}
                                        </p>

                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                            {item.product.name}
                                        </h2>

                                        <p className="text-lg font-bold text-gray-900">
                                            ₹{item.product.price}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {item.product.stock} units available
                                        </p>

                                    </div>

                                    <div className="flex flex-col items-start sm:items-end justify-between">

                                        <p className="text-xl font-bold text-gray-900">
                                            ₹{item.product.price * item.quantity}
                                        </p>

                                        <div className="flex items-center gap-3">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDecrease(item)
                                                }
                                                disabled={item.quantity <= 1}
                                                className="w-9 h-9 border border-gray-300 rounded-lg flex items-center justify-center text-lg font-semibold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                −
                                            </button>

                                            <span className="w-8 text-center font-semibold">
                                                {item.quantity}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleIncrease(item)
                                                }
                                                disabled={
                                                    item.quantity >=
                                                    item.product.stock
                                                }
                                                className="w-9 h-9 border border-gray-300 rounded-lg flex items-center justify-center text-lg font-semibold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                +
                                            </button>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemove(
                                                    item.product._id
                                                )
                                            }
                                            className="text-sm text-red-500 hover:text-red-700 font-medium"
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>

                    <div className="lg:col-span-1">

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-6">

                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Order Summary
                            </h2>

                            <div className="flex justify-between text-gray-600 mb-4">
                                <span>
                                    Items
                                </span>

                                <span>
                                    {totalUnits}
                                </span>
                            </div>

                            <div className="border-t border-gray-200 pt-4">

                                <div className="flex justify-between items-center">

                                    <span className="text-lg font-semibold text-gray-900">
                                        Subtotal
                                    </span>

                                    <span className="text-xl font-bold text-gray-900">
                                        ₹{subtotal}
                                    </span>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/checkout")}
                                className="w-full mt-6 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition"
                            >
                                Proceed to Checkout
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default Cart