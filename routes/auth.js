const UserSchema = require('../model/users')

async function login(req, res){
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    const result = await UserSchema.findOne(user)
    if(!result) res.json({ err: 'user not found !!!' })
    else res.json({user: result})
}

async function signin(req, res) {

    const { identifiant, typeUser, imageUser, mdpUser, matiere, imageMatiere } = req.body
    
    try {
        const user = await UserSchema.create({
            username: identifiant,
            password: mdpUser,
            role: typeUser,
            matiere: matiere,
            photo: imageUser,
            photoMatiere: imageMatiere
        })
        res.json({user})
    } catch (error) {
        console.log(error)
        res.json({err: `${Object.keys(error.keyValue)[0]} ${Object.values(error.keyValue)[0]} existe déjà`})
    }
}
module.exports = { login, signin }
