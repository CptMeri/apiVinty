import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    id_boutique: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    titre: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    type: {
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
    prix: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    taille: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    matiere: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    couleur: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    marque: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    etat: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    annee: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    productImage: {
        type: Array,
        required: true
    },
})

const Product = mongoose.model('Product', ProductSchema)

export default Product