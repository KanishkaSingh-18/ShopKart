import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import customerRoutes from './routes/customer.route.js'
import productRoutes from './routes/product.route.js'
import wishlistRoutes from './routes/wishlist.route.js'
import cartRoutes from './routes/cart.route.js'
import orderRoutes from './routes/order.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()

const app = express()
const port = 8003
app.use(express.json())
app.use(cookieParser())

app.use(cors(
    {
        origin: "http://localhost:5177",
        credentials: true,
    }
))

mongoose.connect(process.env.dbUrl).then(() => {
    console.log("DB connected")
})
    .catch((error) => {
        console.log(error)
    })

app.use('/customers', customerRoutes)
app.use('/products', productRoutes)
app.use('/wishlist', wishlistRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)

app.listen(port, () => {
    console.log("Server started")
})

app.get('/', (req, res) => {
    res.send("server onnn helloooo")
})