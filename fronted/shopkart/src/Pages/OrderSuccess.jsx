import React from "react"
import { useNavigate, useParams } from "react-router-dom"

const OrderSuccess = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-lg w-full text-center">

                <div className="text-6xl mb-5">
                    ✅
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Order Placed Successfully
                </h1>

                <p className="text-gray-500 mb-8">
                    Your order has been saved successfully.
                </p>

                <div className="bg-gray-50 rounded-xl p-5 mb-8 text-left">

                    <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-500">
                            Order ID
                        </span>

                        <span className="font-semibold text-gray-900 break-all ml-4">
                            {id}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">
                            Status
                        </span>

                        <span className="font-semibold text-green-600">
                            PLACED
                        </span>
                    </div>

                </div>

                <div className="flex flex-col sm:flex-row gap-3">

                    <button
                        type="button"
                        onClick={() => navigate("/orders")}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        View My Orders
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                    >
                        Continue Shopping
                    </button>

                </div>

            </div>

        </div>
    )
}

export default OrderSuccess