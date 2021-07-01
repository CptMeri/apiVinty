import AuthShopModel from '../models/AuthShopModel.js';
import AddProductModel from '../models/AddProductModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import createJWT from '../utils/auth.js';

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const getTest = (_, res) => {
    res.send('Hello les gens')
}

export const postTest = (req, res) => {
    res.send(req.body)
}

// ------- Products ------- \\

//Add product to db
export const addProduct = async (req, res) => {
    const product = new AddProductModel({
        id_boutique: req.body.id_boutique,
        titre: req.body.titre,
        type: req.body.type,
        description: req.body.description,
        prix: req.body.prix,
        taille: req.body.taille,
        matiere: req.body.matiere,
        couleur: req.body.couleur,
        marque: req.body.marque,
        etat: req.body.etat,
        annee: req.body.annee,
        productImage: req.body.productImage
    })
    await product.save()
    res.send(product)
}

//read allProduct
export const getProducts = async (req, res) => {
    const products = await AddProductModel.find({}) //{} -> je renvois tout
    res.send(products)
}

//Read one product by ID
export const getProduct = async (req, res) => {
    const product = await AddProductModel.find({ _id: req.params.id }) //{} -> je revois tout
    res.send(product)
}

//Update
export const patchProduct = async (req, res) => {
    const product = await AddProductModel.findByIdAndUpdate(req.params.id, req.body) //{} -> je revois tout
    await product.save()
    res.send(product)
}
//Delete
export const deleteProduct = async (req, res) => {
    const product = await AddProductModel.findByIdAndDelete(req.params.id) //{} -> je revois tout
    if (!product) {
        res.status(404).send('Aucune pièce trouvée')
    }
    res.status(200).send()
}

// ------- Shops ------- \\

//read all
export const getShops = async (req, res) => {
    const shops = await AuthShopModel.find({}) //{} -> je renvois tout
    res.send(shops)
}

//Read one by ID
export const getShop = async (req, res) => {
    const shop = await AuthShopModel.find({ _id: req.params.id }) //{} -> je revois tout
    res.send(shop)
}

//Update
export const patchShop = async (req, res) => {
    const shop = await AuthShopModel.findByIdAndUpdate(req.params.id, req.body) //{} -> je revois tout
    await shop.save()
    res.send(shop)
}

//Delete
export const deleteShop = async (req, res) => {
    const shop = await AuthShopModel.findByIdAndDelete(req.params.id) //{} -> je revois tout
    if (!shop) {
        res.status(404).send('Aucune boutique trouvée')
    }
    res.status(200).send()
}

//Shop SignUp
export const shopSignup = async (req, res, next) => {
    let { name, lastname, email, city, adressShop, shop_name, description, slogan, password, passwordcfm } = req.body;

    let errors = [];
    if (!name) {
        errors.push({ name: "required" });
    }
    if (!lastname) {
        errors.push({ lastname: "required" });
    }
    if (!email) {
        errors.push({ email: "required" });
    }
    if (!city) {
        errors.push({ city: "required" });
    }
    if (!adressShop) {
        errors.push({ adressShop: "required" });
    }
    if (!shop_name) {
        errors.push({ shop_name: "required" });
    }
    if (!description) {
        errors.push({ description: "required" });
    }
    if (!slogan) {
        errors.push({ slogan: "required" });
    }
    if (!emailRegexp.test(email)) {
        errors.push({ email: "invalid" });
    }
    if (!password) {
        errors.push({ password: "required" });
    }
    if (!passwordcfm) {
        errors.push({ passwordcfm: "required" });
    }
    if (password != passwordcfm) {
        errors.push({ password: "mismatch" });
    }
    if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
    }

    AuthShopModel.findOne({ email: email })
        .then(Shop => {
            if (Shop) {
                return res.status(422).json({ errors: [{ Shop: "email already exists" }] });
            } else {
                const shop = new AuthShopModel({
                    name: name,
                    lastname: lastname,
                    email: email,
                    city: city,
                    adressShop: adressShop,
                    shop_name: shop_name,
                    description: description,
                    slogan: slogan,
                    password: password,
                    passwordcfm: passwordcfm,
                });
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) throw err;
                        shop.password = hash;
                        shop.passwordcfm = hash;
                        shop.save()
                            .then(response => {
                                res.status(200).json({
                                    success: true,
                                    result: response
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    errors: [{ error: err }]
                                });
                            });
                    });
                });
            }
        }).catch(err => {
            res.status(500).json({
                errors: [{ error: 'Something went wrong' }]
            });
        })
}

//Shop SignIn
export const shopSignin = async (req, res) => {

    let { email, password } = req.body;
    let errors = [];
    if (!email) {
        errors.push({ email: "required" });
    }
    if (!emailRegexp.test(email)) {
        errors.push({ email: "invalid email" });
    }
    if (!password) {
        errors.push({ password: "required" });
    }
    if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
    }
    AuthShopModel.findOne({ email: email }).then(Shop => {
        if (!Shop) {
            return res.status(404).json({
                errors: [{ Shop: "not found" }],
            });
        } else {
            bcrypt.compare(password, Shop.password).then(isMatch => {
                if (!isMatch) {
                    return res.status(400).json({
                        errors: [{
                            password: "incorrect"
                        }]
                    });
                }
                let access_token = createJWT(
                    Shop.email,
                    Shop._id,
                    3600
                );
                jwt.verify(access_token, process.env.TOKEN_SECRET, (err, decoded) => {
                    if (err) {
                        res.status(500).json({ erros: err });
                    }
                    if (decoded) {
                        return res.status(200).json({
                            success: true,
                            token: access_token,
                            message: Shop
                        });
                    }
                });
            }).catch(err => {
                console.log(password);
                res.status(500).json({ erros: err });
            });
        }
    }).catch(err => {
        res.status(500).json({ erros: err });
    });
}