import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { axiosInstance } from "../axiosCalls/axios"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const { customer, loading: authLoading } = useAuth()

    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const refreshCart = async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true)
            }

            setError("")

            const response = await axiosInstance.get("/cart")

            setCartItems(response.data.cart)
        }
        catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load cart"
            )
        }
        finally {
            if (showLoading) {
                setLoading(false)
            }
        }
    }

    const addToCart = async (productId) => {
        try {
            setError("")

            const response = await axiosInstance.post(
                `/cart/${productId}`
            )

            await refreshCart(false)

            return response.data
        }
        catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to add product to cart"
            )

            throw error
        }
    }

    const updateQuantity = async (productId, quantity) => {
        try {
            setError("")

            const response = await axiosInstance.patch(
                `/cart/${productId}`,
                { quantity }
            )

            await refreshCart(false)

            return response.data
        }
        catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to update quantity"
            )

            throw error
        }
    }

    const removeFromCart = async (productId) => {
        try {
            setError("")

            const response = await axiosInstance.delete(
                `/cart/${productId}`
            )

            await refreshCart(false)

            return response.data
        }
        catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to remove product"
            )

            throw error
        }
    }

    const clearCart = () => {
        setCartItems([])
    }

    useEffect(() => {
        if (authLoading) return

        if (customer) {
            refreshCart()
        } else {
            setCartItems([])
            setLoading(false)
        }
    }, [authLoading, customer])

    return (
        <CartContext.Provider
            value={{
                cartItems,
                loading,
                error,
                addToCart,
                removeFromCart,
                updateQuantity,
                refreshCart,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)