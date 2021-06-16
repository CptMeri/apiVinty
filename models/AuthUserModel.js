import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({

// Nom prenom mail date de naissance et mdps
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
    date: {
        type: Date,
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

const User = mongoose.model('User', UserSchema)

export default User