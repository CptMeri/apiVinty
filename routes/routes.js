import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
    getTest,
    postTest,
    addProduct,
    getProducts,
    getProduct,
    patchProduct,
    deleteProduct,
    getShops,
    getShop,
    patchShop,
    deleteShop,
    shopSignin,
    shopSignup,
} from '../controllers/AuthShopController.js';
import {
    getUsers,
    getUser,
    patchUser,
    deleteUser,
    userSignup,
    userSignin
} from '../controllers/AuthUserController.js';

//create require func
import { catchErrors } from './../helpers.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
//stripe key
const stripe = require("stripe")("sk_test_51JEBV2BoY10D9MdLkEbaZMDCFvfhoPFhF4HEyIWh7f6onxBYNO1x7llS2lpa14YXqKOuHn75iZHTOxd95WRRQoJY00s1jJPI03");

const router = express.Router()

router.get('/', (_, res) => {
    res.send('Hello les gens')
})
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        var id = Math.random().toString(36).substring(7) + Date.now() + path.extname(file.originalname);
        cb(null, id);
    }
})

const upload = multer({ storage: storage });

// TESTS
router.get('/api/test', getTest)
router.post('/api/test', postTest)

//reccup img comme un CDN 

//Action produit
// router.post('/api/product', upload.single("productImage"), catchErrors(addProduct))
router.post('/api/product', upload.array("photos"), function (req, res) {
    const images = [];
    res.req.files.forEach(element => {
        images.push(element.filename)
    });
    req.body.productImage = images;
    addProduct(req, res);
}, catchErrors(addProduct));

router.post('/api/profilboutique', upload.single("recfile"), function (req, res) {
    var oldPath = req.file.path;
    var newPath = 'uploads/profile/' + req.body.idboutique + '.png'
    fs.rename(oldPath, newPath, function (err) {
        if (err) throw err
        console.log('Successfully renamed - AKA moved!')
        res.send('Successfully upload!')
    });
});
router.post('/api/profilboutiqueBis', upload.single("recfile"), function (req, res) {
    var oldPath = req.file.path;
    var newPath = 'uploads/profilebis/' + req.body.idboutique + '.png'
    fs.rename(oldPath, newPath, function (err) {
        if (err) throw err
        console.log('Successfully renamed - AKA moved!')
        res.send('Successfully upload!')
    });
});
const calculateOrderAmount = items => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    let amount = 0;
    for(let i in items){
        amount += ((parseInt(items[i].prix) * 100) * items[i].quantity)
    }
    return amount;
  };
router.post("/api/create-payment-intent", async (req, res) => {
    const { items } = req.body;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "eur",
    });
    res.send({
      clientSecret: paymentIntent.client_secret
    });
  });

router.get('/api/products', catchErrors(getProducts))
router.get('/api/product/:id', catchErrors(getProduct))
router.patch('/api/product/:id', catchErrors(patchProduct))
router.delete('/api/product/:id', catchErrors(deleteProduct))

//Action produit
router.get('/api/shops', catchErrors(getShops))
router.get('/api/shop/:id', catchErrors(getShop))
router.patch('/api/shop/:id', catchErrors(patchShop))
router.delete('/api/shop/:id', catchErrors(deleteShop))
router.post('/api/shopSignup', catchErrors(shopSignup))
router.post('/api/shopSignin', catchErrors(shopSignin))

//Action User
// router.post('/api/user', catchErrors(addUser))
router.get('/api/users', catchErrors(getUsers))
router.get('/api/user/:id', catchErrors(getUser))
router.patch('/api/user/:id', catchErrors(patchUser))
router.delete('/api/user/:id', catchErrors(deleteUser))
router.post('/api/userSignup', catchErrors(userSignup))
router.post('/api/userSignin', catchErrors(userSignin))

export default router