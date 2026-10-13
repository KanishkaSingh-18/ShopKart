import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { axiosInstance } from "../axiosCalls/axios"

const OrderDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchOrder = async () => {
        try {
            setLoading(true)
            setError("")

            const response = await axiosInstance.get(
                `/orders/${id}`
            )

            setOrder(response.data.order)
        }
        catch (error) {
            console.error(error)

            setError(
                error.response?.data?.message ||
                "Unable to load order details."
            )
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrder()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">
                    Loading order details...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-6">

                <p className="text-red-500 text-center">
                    {error}
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/orders")}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
                >
                    Back to My Orders
                </button>

            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">

            <div className="max-w-5xl mx-auto">

                <button
                    type="button"
                    onClick={() => navigate("/orders")}
                    className="text-blue-600 font-medium hover:text-blue-700 mb-6"
                >
                    ← Back to My Orders
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Order Details
                        </h1>

                        <p className="text-sm text-gray-500 mt-2 break-all">
                            Order ID: {order._id}
                        </p>
                    </div>

                    <div className="text-left sm:text-right">

                        <p className="text-sm text-gray-500">
                            Status
                        </p>

                        <p className="font-semibold text-green-600">
                            {order.status}
                        </p>

                    </div>

                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">

                    <h2 className="text-xl font-bold text-gray-900 mb-5">
                        Order Information
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                        <div>
                            <p className="text-sm text-gray-500">
                                Order Date
                            </p>

                            <p className="font-medium text-gray-900 mt-1">
                                {new Date(
                                    order.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Payment Status
                            </p>

                            <p className="font-medium text-green-600 mt-1">
                                {order.paymentStatus}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Amount
                            </p>

                            <p className="font-bold text-gray-900 mt-1">
                                ₹{order.totalAmount}
                            </p>
                        </div>

                    </div>

                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">

                    <h2 className="text-xl font-bold text-gray-900 mb-5">
                        Items
                    </h2>

                    <div className="space-y-5">

                        {order.items.map((item, index) => (
                            <div
                                key={`${order._id}-${index}`}
                                className="flex flex-col sm:flex-row gap-4 sm:items-center"
                            >

                                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center p-2 shrink-0">

                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                        />
                                    )}

                                </div>

                                <div className="flex-1">

                                    <h3 className="font-semibold text-gray-900">
                                        {item.name}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        ₹{item.price} × {item.quantity}
                                    </p>

                                </div>

                                <p className="font-bold text-gray-900">
                                    ₹{item.price * item.quantity}
                                </p>

                            </div>
                        ))}

                    </div>

                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">

                    <h2 className="text-xl font-bold text-gray-900 mb-5">
                        Shipping Address
                    </h2>

                    <div className="text-gray-600 space-y-1">

                        <p className="font-medium text-gray-900">
                            {order.shippingAddress.fullName}
                        </p>

                        <p>
                            {order.shippingAddress.addressLine1}
                        </p>

                        <p>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state} -{" "}
                            {order.shippingAddress.pincode}
                        </p>

                        <p>
                            Phone: {order.shippingAddress.phone}
                        </p>

                    </div>

                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

                    <div className="flex justify-between items-center">

                        <span className="text-xl font-semibold text-gray-900">
                            Total
                        </span>

                        <span className="text-2xl font-bold text-gray-900">
                            ₹{order.totalAmount}
                        </span>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default OrderDetails