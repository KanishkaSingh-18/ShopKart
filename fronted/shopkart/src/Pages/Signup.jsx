import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosCalls/axios';

export default function ShopkartSignup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

  const navigate = useNavigate()

  const [loader, setLoader] = useState(false)
  const [err, setErr] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true)

    try {
      const res = await axiosInstance.post('/customers/register', formData)
      setLoader(false)
      console.log('Customer registered')
      navigate('/login')
    }

    catch (error) {
      setLoader(false)
      setErr(error.message)
      console.log(error.message)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">

        {/* Shopkart Brand Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {/* Shopping Bag Icon Logo */}
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Shop<span className="text-indigo-600">kart</span>
            </span>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            Create your shopping account
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Get exclusive deals, track orders & faster checkout
          </p>
        </div>

        {/* Form Fields */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Sarah Jenkins"
              className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all duration-150"
            />
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="sarah@example.com"
              className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all duration-150"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all duration-150"
            />
          </div>

          {/* Phone Number with country prefix */}
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Phone Number
            </label>
            <div className="relative flex">
              <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg font-medium">
                +1
              </span>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 000-0000"
                className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-gray-50 rounded-r-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all duration-150"
              />
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center pt-1">
            <input
              id="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-xs text-gray-500">
              I agree to the <a href="/terms" className="text-indigo-600 hover:underline">Terms of Service</a> & <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 active:scale-[0.99]"
          >
            Create Shopkart Account
          </button>
        </form>

        {/* Footer / Login Link */}
        <div className="border-t border-gray-100 pt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}