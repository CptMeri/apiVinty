import mongoose from 'mongoose'

const ShopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    city: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    adressShop: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    shop_name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    slogan: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    passwordcfm: {
        type: String,
        required: true,
        trim: true,
    },
})

const Shop = mongoose.model('Shop', ShopSchema)

export default Shop