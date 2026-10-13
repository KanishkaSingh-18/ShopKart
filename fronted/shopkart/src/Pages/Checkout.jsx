import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { axiosInstance } from "../axiosCalls/axios"

const Checkout = () => {
    const navigate = useNavigate()

    const {
        cartItems,
        loading,
        clearCart
    } = useCart()

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: ""
    })

    const [error, setError] = useState("")
    const [placingOrder, setPlacingOrder] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }))

        setError("")
    }

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            return "Full Name is required."
        }

        if (!formData.phone.trim()) {
            return "Phone Number is required."
        }

        if (!formData.addressLine1.trim()) {
            return "Address Line is required."
        }

        if (!formData.city.trim()) {
            return "City is required."
        }

        if (!formData.state.trim()) {
            return "State is required."
        }

        if (!formData.pincode.trim()) {
            return "Pincode is required."
        }

        const phoneRegex = /^[6-9]\d{9}$/

        if (!phoneRegex.test(formData.phone.trim())) {
            return "Please enter a valid 10-digit phone number."
        }

        const pincodeRegex = /^\d{6}$/

        if (!pincodeRegex.test(formData.pincode.trim())) {
            return "Pincode must contain 6 digits."
        }

        return ""
    }

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true)
                return
            }

            const script = document.createElement("script")

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js"

            script.onload = () => resolve(true)

            script.onerror = () => resolve(false)

            document.body.appendChild(script)
        })
    }

    const handlePaymentSuccess = async (
        paymentResponse,
        orderData
    ) => {
        try {
            const response = await axiosInstance.post(
                "/orders/verify-payment",
                {
                    shopKartOrderId: orderData.shopKartOrderId,
                    razorpay_order_id:
                        paymentResponse.razorpay_order_id,
                    razorpay_payment_id:
                        paymentResponse.razorpay_payment_id,
                    razorpay_signature:
                        paymentResponse.razorpay_signature
                }
            )

            if (response.data.success) {
                clearCart()

                navigate(
                    `/order-success/${orderData.shopKartOrderId}`
                )
            }
        }
        catch (error) {
            setError(
                error.response?.data?.message ||
                "Payment verification failed."
            )
        }
        finally {
            setPlacingOrder(false)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const validationError = validateForm()

        if (validationError) {
            setError(validationError)
            return
        }

        try {
            setPlacingOrder(true)
            setError("")

            const razorpayLoaded = await loadRazorpayScript()

            if (!razorpayLoaded) {
                setError(
                    "Unable to load Razorpay. Please try again."
                )

                setPlacingOrder(false)
                return
            }

            const response = await axiosInstance.post(
                "/orders/create-payment-order",
                {
                    shippingAddress: formData
                }
            )

            const orderData = response.data

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,

                name: "ShopKart",

                description: "ShopKart Order",

                order_id: orderData.razorpayOrderId,

                handler: async function (paymentResponse) {
                    await handlePaymentSuccess(
                        paymentResponse,
                        orderData
                    )
                },

                prefill: {
                    name: formData.fullName,
                    contact: formData.phone
                },

                theme: {}
            }

            const paymentObject =
                new window.Razorpay(options)

            paymentObject.on(
                "payment.failed",
                function (response) {
                    console.error(
                        "Payment failed:",
                        response.error
                    )

                    setError(
                        response.error?.description ||
                        "Payment failed. Please try again."
                    )

                    setPlacingOrder(false)
                }
            )

            paymentObject.open()
        }
        catch (error) {
            console.error(error)

            setError(
                error.response?.data?.message ||
                "Unable to create payment order."
            )

            setPlacingOrder(false)
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
                    Add some products before checking out.
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

    const totalAmount = cartItems.reduce(
        (total, item) =>
            total +
            item.product.price * item.quantity,
        0
    )

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="max-w-6xl mx-auto">

                <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-900 font-medium"
                >
                    ← Back to Cart
                </button>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Checkout
                </h1>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2">

                        <form
                            onSubmit={handleSubmit}
                            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                        >

                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Shipping Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address Line
                                    </label>

                                    <input
                                        type="text"
                                        name="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pincode
                                    </label>

                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                    />
                                </div>

                            </div>

                            <button
                                type="submit"
                                disabled={placingOrder}
                                className="w-full mt-8 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {placingOrder
                                    ? "Processing..."
                                    : "Place Order"
                                }
                            </button>

                        </form>

                    </div>

                    <div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-6">

                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4">

                                {cartItems.map((item) => (
                                    <div
                                        key={item.product._id}
                                        className="flex justify-between gap-4"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {item.product.name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                × {item.quantity}
                                            </p>
                                        </div>

                                        <p className="font-semibold text-gray-900">
                                            ₹
                                            {item.product.price *
                                                item.quantity}
                                        </p>
                                    </div>
                                ))}

                            </div>

                            <div className="border-t border-gray-200 mt-6 pt-5">

                                <div className="flex justify-between items-center">

                                    <span className="text-lg font-semibold text-gray-900">
                                        Total
                                    </span>

                                    <span className="text-xl font-bold text-gray-900">
                                        ₹{totalAmount}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default Checkout