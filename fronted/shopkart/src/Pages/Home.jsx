import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { customer } = useAuth()
  const navigate = useNavigate()

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <p className="text-blue-600 font-medium mb-2">
            Welcome back 👋
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Hello, {customer.fullName}!
          </h1>

          <p className="text-gray-500">
            Welcome to your product catalog. Explore products,
            discover new items and manage your shopping easily.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">
            Your Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">
                Name
              </p>
              <p className="font-medium text-gray-900">
                {customer.fullName}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">
                Email
              </p>
              <p className="font-medium text-gray-900">
                {customer.email}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">
                Account
              </p>
              <p className="font-medium text-gray-900">
                Customer
              </p>
            </div>

          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-5">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div
              onClick={() => navigate('/products')}
              className="bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer hover:shadow-md transition"
            >
              <div className="text-3xl mb-3">
                🛍️
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Browse Products
              </h3>

              <p className="text-gray-500 text-sm">
                Explore products, search by name and filter
                products by category.
              </p>

              <button className="mt-4 text-blue-600 font-medium">
                View Products →
              </button>
            </div>

            <div
              onClick={() => navigate('/cart')}
              className="bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer hover:shadow-md transition"
            >
              <div className="text-3xl mb-3">
                🛒
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your Cart
              </h3>

              <p className="text-gray-500 text-sm">
                View and manage the products you have added
                to your cart.
              </p>

              <button className="mt-4 text-blue-600 font-medium">
                Go to Cart →
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Home