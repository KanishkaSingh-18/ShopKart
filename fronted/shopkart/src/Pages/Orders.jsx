import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { axiosInstance } from "../axiosCalls/axios"

const Orders = () => {
    const navigate = useNavigate()

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchOrders = async () => {
        try {
            setLoading(true)
            setError("")

            const response = await axiosInstance.get("/orders")

            setOrders(response.data.orders)
        }
        catch (error) {
            console.error(error)

            setError(
                error.response?.data?.message ||
                "Unable to load your orders."
            )
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">
                    Loading your orders...
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
                    onClick={fetchOrders}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
                >
                    Try Again
                </button>

            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-6">

                <div className="text-5xl mb-4">
                    📦
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    No Orders Yet
                </h1>

                <p className="text-gray-500 mb-6">
                    You have not placed any orders yet.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
                >
                    Start Shopping
                </button>

            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">

            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    My Orders
                </h1>

                <div className="flex items-center justify-between mb-6">
                    <button
                        type="button"
                        onClick={() => navigate("/home")}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        ← Back to Home
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                        className="border border-blue-600 text-blue-600 px-4 py-2 rounded-xl font-medium hover:bg-blue-50 transition"
                    >
                        Continue Shopping
                    </button>
                </div>

                <div className="space-y-5">

                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                        >

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Order ID
                                    </p>

                                    <p className="font-semibold text-gray-900 break-all">
                                        {order._id}
                                    </p>

                                </div>

                                <div className="sm:text-right">

                                    <p className="text-sm text-gray-500">
                                        Date
                                    </p>

                                    <p className="font-medium text-gray-900">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </p>

                                </div>

                            </div>

                            <div className="border-t border-gray-200 pt-5 space-y-4">

                                {order.items.map((item, index) => (
                                    <div
                                        key={`${order._id}-${index}`}
                                        className="flex items-center gap-4"
                                    >

                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center p-2 shrink-0">

                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            )}

                                        </div>

                                        <div className="flex-1">

                                            <p className="font-medium text-gray-900">
                                                {item.name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                ₹{item.price} × {item.quantity}
                                            </p>

                                        </div>

                                        <p className="font-semibold text-gray-900">
                                            ₹{item.price * item.quantity}
                                        </p>

                                    </div>
                                ))}

                            </div>

                            <div className="border-t border-gray-200 mt-5 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                <div className="flex items-center gap-6">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Total
                                        </p>

                                        <p className="text-xl font-bold text-gray-900">
                                            ₹{order.totalAmount}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Status
                                        </p>

                                        <p className="font-semibold text-green-600">
                                            {order.status}
                                        </p>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/orders/${order._id}`
                                        )
                                    }
                                    className="border border-blue-600 text-blue-600 px-5 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition"
                                >
                                    View Details
                                </button>

                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    )
}

export default Orders