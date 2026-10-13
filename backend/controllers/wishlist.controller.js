import mongoose from "mongoose"
import Product from "../models/product.model.js"

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" })
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        if (req.customer.wishlist.includes(product._id)) {
            return res.status(409).json({ message: "Product already in wishlist" })
        }

        req.customer.wishlist.push(productId)

        await req.customer.save()

        return res.status(200).json({
            success: true,
            message: "Product added to wishlist"
        })
    }

    catch (error) {
        return res.status(500).json({
            message: "Server crashed",
            error: error.message
        })
    }
}

export const getWishlist = async (req, res) => {
    try {
        const customer = await req.customer.populate({
            path: "wishlist",
            select: "name price category image stock"
        })

        return res.status(200).json({
            success: true,
            count: customer.wishlist.length,
            wishlist: customer.wishlist
        })
    }

    catch (error) {
        return res.status(500).json({
            message: "Server crashed",
            error: error.message
        })
    }
}

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            })
        }

        const productIndex = req.customer.wishlist.findIndex(
            id => id.toString() === productId
        )

        if (productIndex === -1) {
            return res.status(404).json({
                message: "Product not in wishlist"
            })
        }

        req.customer.wishlist.splice(productIndex, 1)

        await req.customer.save()

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            count: req.customer.wishlist.length
        })
    }

    catch (error) {
        return res.status(500).json({
            message: "Server crashed",
            error: error.message
        })
    }
}

export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            })
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        const productIndex = req.customer.wishlist.findIndex(
            id => id.toString() === productId
        )

        if (productIndex === -1) {
            req.customer.wishlist.push(product._id)

            await req.customer.save()

            return res.status(200).json({
                success: true,
                saved: true,
                message: "Product added to wishlist",
                count: req.customer.wishlist.length
            })
        }

        req.customer.wishlist.splice(productIndex, 1)

        await req.customer.save()

        return res.status(200).json({
            success: true,
            saved: false,
            message: "Product removed from wishlist",
            count: req.customer.wishlist.length
        })
    }

    catch (error) {
        return res.status(500).json({
            message: "Server crashed",
            error: error.message
        })
    }
}