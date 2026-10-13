import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid Product ID"
            })
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        const cartItem = req.customer.cart.find(
            item => item.product.toString() === productId
        )

        const newQuantity = cartItem ? cartItem.quantity + 1 : 1

        if (newQuantity > product.stock) {
            return res.status(400).json({
                message: "Requested quantity exceeds available stock"
            })
        }

        if (cartItem) {
            cartItem.quantity += 1
        }

        else {
            req.customer.cart.push({
                product: product._id,
                quantity: 1
            })
        }

        await req.customer.save()

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: req.customer.cart
        })
    }

    catch (error) {
        return res.status(500).json({
            message: "Server crashed",
            error: error.message
        })
    }
}

export const getCart = async (req, res) => {
    try {
        const customer = await req.customer.populate({
            path: "cart.product",
            select: "name price image stock category"
        })

        return res.status(200).json({
            success: true,
            cart: customer.cart
        })
    }

    catch (error) {
        return res.status(500).json({
            message: "Server crashed",
            error: error.message
        })
    }
}

export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params
        const { quantity } = req.body

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            })
        }

        if (typeof quantity !== "number" || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be a number and at least 1"
            })
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        const cartItem = req.customer.cart.find(
            item => item.product.toString() === productId
        )

        if (!cartItem) {
            return res.status(404).json({
                message: "Product not in cart"
            })
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Quantity exceeds available stock"
            })
        }

        cartItem.quantity = quantity

        await req.customer.save()

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: req.customer.cart
        })
    }

    catch (error) {
        return res.status(500).json({
            message: "Server crashed",
            error: error.message
        })
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            })
        }

        const cartItemIndex = req.customer.cart.findIndex(
            item => item.product.toString() === productId
        )

        if (cartItemIndex === -1) {
            return res.status(404).json({
                message: "Product not in cart"
            })
        }

        req.customer.cart.splice(cartItemIndex, 1)

        await req.customer.save()

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: req.customer.cart
        })
    }

    catch (error) {
        return res.status(500).json({
            message: "Server crashed",
            error: error.message
        })
    }
}
