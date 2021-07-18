import AuthUserModel from '../models/AuthUserModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import createJWT from '../utils/auth.js'

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const getTest = (_, res) => {
    res.send('Hello les gens')
}

export const postTest = (req, res) => {
    res.send(req.body)
}

// export const addUser = async (req, res) => {
//     const user = new AuthUserModel(req.body)
//     await user.save()
//     res.send(user)
// }

//read all
export const getUsers = async (req, res) => {
    const users = await AuthUserModel.find({}) //{} -> je revois tout
    res.send(users)
}

//Read one by ID
export const getUser = async (req, res) => {
    const user = await AuthUserModel.find({ _id: req.params.id }) //{} -> je revois tout
    res.send(user)
}

//Update
export const patchUser = async (req, res) => {
    const user = await AuthUserModel.findByIdAndUpdate(req.params.id, req.body) //{} -> je revois tout
    await user.save()
    res.send(user)
}

//Delete
export const deleteUser = async (req, res) => {
    const user = await AuthUserModel.findByIdAndDelete(req.params.id) //{} -> je revois tout
    if (!user) {
        res.status(404).send('Aucun utilisateur trouvé')
    }
    res.status(200).send()
}

//User SignUp
export const userSignup = async (req, res, next) => {
    let { name, lastname, email, date, password, passwordcfm } = req.body;

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
    if (!date) {
        errors.push({ date: "required" });
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

    AuthUserModel.findOne({ email: email })
        .then(User => {
            if (User) {
                return res.status(422).json({ errors: [{ User: "email already exists" }] });
            } else {
                const user = new AuthUserModel({
                    name: name,
                    lastname: lastname,
                    email: email,
                    date: date,
                    password: password,
                    passwordcfm: passwordcfm,
                });
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) throw err;
                        user.password = hash;
                        user.passwordcfm = hash;
                        user.save()
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

//User SignIn
export const userSignin = async (req, res) => {

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
    AuthUserModel.findOne({ email: email }).then(User => {
        if (!User) {
            return res.status(404).json({
                errors: [{ User: "not found" }],
            });
        } else {
            bcrypt.compare(password, User.password).then(isMatch => {
                if (!isMatch) {
                    return res.status(400).json({
                        errors: [{
                            password: "incorrect"
                        }]
                    });
                }
                let access_token = createJWT(
                    User.email,
                    User._id,
                    3600
                );
                jwt.verify(access_token, "correct horse battery staple", (err, decoded) => {
                    if (err) {
                        res.status(500).json({ erros: err });
                    }
                    if (decoded) {
                        return res.status(200).json({
                            success: true,
                            token: access_token,
                            message: User
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