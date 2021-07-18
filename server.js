import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import routes from './routes/routes.js'
import cors from 'cors'
dotenv.config()

//app
const app = express()

app.use(cors())

//db
mongoose.connect("mongodb+srv://lukdev:Crapule.03@cluster0.cc3rm.mongodb.net/NODE-API?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

//middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(routes)

const PORT = process.env.PORT || 1223

app.listen(PORT, () => {
    console.log(`Le serveur est lancé sur le port : ${PORT}`)
})

app.use('/uploads', express.static('uploads'));