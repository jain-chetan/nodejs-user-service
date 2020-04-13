const repository = require('../dbRepo/repository')
var bcrypt = require('bcrypt');
const config = require('../config/config') 
var security = require('../utilities/security')
const jwt = require('jsonwebtoken')
const logger = require('../utilities/logger')

exports.pingHandler = async (req, res) => {
    res.send({ "Status": "200 OK" })
}

exports.getHandler = async (req, res) => {
    try {
        const token = req.headers[ "token" ];
        console.log(token)
        console.log(req.headers["token"])
        if (token){
            tokenDetails = security(token)
        }else{
            throw ("Invalid token")
        }
        const user = await repository.getUser(tokenDetails._id); 
        user.password = ""; 
        res.send(user);
    }
    catch (err) {
        res.status(405).json({code: 405,  message:err})
    }
}

exports.insertHandler = async (req, res) => {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        if (await repository.userExists(req.body.email)){
            throw(`User already exists`);
        }
        await repository.registerUser(req.body);
        res.set({
            'Content-Type': 'application/json',
            'Status' : 201})
        res.send({ "code": 201, "message":"User created successfully"})
    } catch (err) {
        logger.error(`Error in creating user: `, err);
        res.status(405).json({code: 405,  message:"Couldn't create user"})
    }
}

exports.loginHandler = async(req,res)=>{
    try{
        const user = await repository.getUserByEmail(req.body.email)
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign(user.toObject(), config.secretKey, { expiresIn: 86400 });
            res.set({
                'Content-Type': 'application/json',
                'Status' : 200
            })
            res.send({ "code": 200, "message":"User authenticated successfully", "token":token})
        }else{
            throw("Invalid credentials")
        }
    }
    catch (err) {
        logger.error(`Invalid user details:`, err);
        res.status(405).json({code: 405,  message:"Couldn't authenticate user"})
    }
}

exports.updateHandler = async (req,res)=>{
    try{
        const token = req.headers[ "token" ];
        if (token){
            tokenDetails = security(token)
        }else{
            throw ("Invalid token")
        }
        if (!await repository.userExists(tokenDetails.email)){
            throw("User doesnt exists");
        }
        await repository.updateUser(tokenDetails._id,req.body);
        res.set({
            'Content-Type': 'application/json',
            'Status' : 200})
        res.send({ "code": 200, "message":"User details updated successfully"})
            
        }catch(err){
            logger.error(`Error in updating user`, err);
            res.status(405).json({code: 405,  message:"Couldn't update user"})
    }
}

exports.deleteHandler = async(req,res)=>{
    try{
        const token = req.headers[ "token" ];
        if (token){
            tokenDetails = security(token)
        }else{
            throw ("Invalid token")
        }
        if (!await repository.userExists(tokenDetails.email)){
            throw("User doesnt exists");
        }

        await repository.deleteUser(tokenDetails._id);
        res.set({
            'content-Type':'application/json',
            'Status':200})
            res.send({ "code": 200, "message":"User deleted successfully"})
        }catch(err){
            logger.error(`Error in deleting user`, err);
            res.status(405).json({code: 405,  message:"Couldn't delete user"})
    }
}

