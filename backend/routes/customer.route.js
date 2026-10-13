import express from 'express'
import { registerCustomer } from '../controllers/customer.controller.js'
import { loginCustomer } from '../controllers/customer.controller.js'
import { getMe } from '../controllers/customer.controller.js'
import { isAuthenticated } from '../middlewares/authMiddleware.js'
import { logoutCustomer } from '../controllers/customer.controller.js'

const customerRoutes = express.Router()

customerRoutes.post('/register', registerCustomer)
customerRoutes.post('/login', loginCustomer)
customerRoutes.post('/logout', logoutCustomer)
customerRoutes.get('/me', isAuthenticated, getMe)

export default customerRoutes