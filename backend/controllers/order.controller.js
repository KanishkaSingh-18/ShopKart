import crypto from "crypto"
import razorpay from "../config/razorpay.js"
import Order from "../models/order.model.js"
import Product from "../models/product.model.js";

export const createPaymentOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body

        if (!shippingAddress) {
            return res.status(400).json({
                message: "Shipping address is required"
            })
        }

        const requiredFields = [
            "fullName",
            "phone",
            "addressLine1",
            "city",
            "state",
            "pincode"
        ]

        for (const field of requiredFields) {
            if (
                !shippingAddress[field] ||
                !shippingAddress[field].trim()
            ) {
                return res.status(400).json({
                    message: `${field} is required`
                })
            }
        }

        const customer = await req.customer.populate({
            path: "cart.product",
            select: "name price image stock"
        })

        if (!customer.cart || customer.cart.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            })
        }

        let totalAmount = 0
        const orderItems = []

        for (const cartItem of customer.cart) {

            const product = cartItem.product

            if (!product) {
                return res.status(400).json({
                    message: "Product in cart no longer exists"
                })
            }

            if (cartItem.quantity > product.stock) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}.`
                })
            }

            totalAmount += product.price * cartItem.quantity

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image
            })
        }

        const order = await Order.create({
            user: customer._id,

            items: orderItems,

            shippingAddress: {
                fullName: shippingAddress.fullName.trim(),
                phone: shippingAddress.phone.trim(),
                addressLine1: shippingAddress.addressLine1.trim(),
                city: shippingAddress.city.trim(),
                state: shippingAddress.state.trim(),
                pincode: shippingAddress.pincode.trim()
            },

            totalAmount,

            paymentStatus: "PENDING",

            status: "PENDING_PAYMENT"
        })

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: order._id.toString()
        })

        order.razorpayOrderId = razorpayOrder.id

        await order.save()

        return res.status(201).json({
            success: true,

            shopKartOrderId: order._id,

            razorpayOrderId: razorpayOrder.id,

            amount: razorpayOrder.amount,

            currency: razorpayOrder.currency,

            key: process.env.RAZORPAY_KEY_ID
        })
    }

    catch (error) {
        console.log(error)

        return res.status(500).json({
            message: "Failed to create payment order",
            error: error.message
        })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const {
            shopKartOrderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body

        if (
            !shopKartOrderId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details are required"
            })
        }

        const order = await Order.findOne({
            _id: shopKartOrderId,
            user: req.customer._id
        })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        if (razorpay_order_id !== order.razorpayOrderId) {
            return res.status(400).json({
                success: false,
                message: "Razorpay order ID mismatch"
            })
        }

        const body =
            order.razorpayOrderId + "|" + razorpay_payment_id

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex")

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            })
        }

        for (const item of order.items) {
            const product = await Product.findById(item.product);

            if (!product || product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.name}`
                });
            }
        }

        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } }
            );
        }

        order.paymentStatus = "PAID"
        order.status = "PLACED"
        order.razorpayPaymentId = razorpay_payment_id

        await order.save()

        req.customer.cart = []

        await req.customer.save()

        return res.status(200).json({
            success: true,
            message: "Payment verified and order placed",
            order
        })
    }

    catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.message
        })
    }
}

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.customer._id
        })
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            orders
        })
    }
    catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        })
    }
}

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params

        const order = await Order.findOne({
            _id: id,
            user: req.customer._id
        })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        return res.status(200).json({
            success: true,
            order
        })
    }
    catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: error.message
        })
    }
}