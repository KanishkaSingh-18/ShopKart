// register controller
import Customer from "../models/customer.model.js"
import bcrypt from 'bcrypt'
import genToken from "../utils/generateToken.js"

const cookieOptions = {
    httpOnly: true
}

export const registerCustomer = async(req,res)=>{
    try{
        const {fullName, email, password, phone} = req.body

        if(!fullName || !email || !password || !phone){
            return res.status(400).json({message: "All fields required"})
        }

        if(password.length <= 6){
            return res.status(400).json({message: "Password should be greater than 6 characters"})
        }

        const nameExists = await Customer.findOne({fullName})

        if(nameExists){
            return res.status(409).json({message: "User already exists"})
        }

        const emailExists = await Customer.findOne({email})

        if(emailExists){
            return res.status(409).json({message: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newCustomer = await Customer.create({
            fullName,
            email,
            password: hashedPassword,
            phone
        })

        const token = genToken(newCustomer._id)

        res.cookie('token', token, cookieOptions)

        res.status(201).json({
            message: "Customer registered successfully", customer : newCustomer
        })
    }

    catch(error){
        res.status(500).json({message: "Server crashed", error:error.message})
    }
}


export const loginCustomer = async(req,res)=>{
    try{
        const {email, password} = req.body 

        if(!email || !password){
            res.status(400).json({message: "All fields required"})
        }

        const customer = await Customer.findOne({email})

        if(!customer){
            res.status(404).json({message: "User not found"})
        }

        const passwordMatched = await bcrypt.compare(password, customer.password)

        if(!passwordMatched){
            res.status(401).json({message: "Invalid password"})
        }

        const token = genToken(customer._id)

        res.cookie('token', token, cookieOptions)

        res.status(200).json({message: "Customer logged In", customerData:customer})
    }

    catch(error){
        res.status(500).json({message: "Server crashed", error: error.message})
    }
}

export const logoutCustomer = async(req,res)=>{
    res.clearCookie('token', cookieOptions)

    res.status(200).json({message: "Logged out successfully"})
}

export const getMe = async (req,res)=>{
    if(!req.customer){
        res.status(404).json({message: "User not found"})
    }

    const authenticatedCustomer = req.customer 

    res.status(200).send({authenticatedCustomer})
}
