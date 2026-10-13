import mongoose from "mongoose"
import Product from "../models/product.model.js"

export const createProduct = async(req,res)=>{
    try{
        const {name, description, price, category, image, stock} = req.body

        if(!name || !description || !price || !category || !image || !stock){
            res.status(400).json({message: "This field is required"})
        }

        if(price<=0){
            res.status(400).json({message: "Invalid price"})
        }

        if(stock<0){
            res.status(400).json({message: "Invalid stock"})
        }

        const newProduct = await Product.create({
                    name,
                    description,
                    price,
                    category,
                    image,
                    stock
                })

        res.status(201).json({message: "Product created successfully", product: newProduct})
    }

    catch(error){
        res.status(500).json({message: "Server crashed", error:error.message})
    }
}

export const getAllProducts = async (req,res) => {
    try{
        const { search, category } = req.query

        const query = {}

        if(search){
            query.name = {
                $regex: search,
                $options: "i"
            }
        }

        if(category){
            query.category = category
        }

        const products = await Product.find(query).select("name price category image stock")

        res.status(201).json({
            succes: true,
            count: products.length,
            products: products
        })
    }

    catch(error){
        res.status(500).json({message: "Server crashed", error:error.message})
    }
}

export const getProductById = async (req, res)=>{
    try{
        const {id} = req.params

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "Invalid product ID"
            })
        }

        const product = await Product.findById(id)

        if(!product){
            return res.status(404).json({message: "Product not found"})
        }

        res.status(200).json({product: product})
    }

    catch(error){
        res.status(500).json({message: "Server crashed", error:error.message})
    }
}