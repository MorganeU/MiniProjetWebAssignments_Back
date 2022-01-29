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
module.exports = { login }
