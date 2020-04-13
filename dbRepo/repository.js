const mongoose = require('mongoose');
mongoose.set('debug', true);
const User = mongoose.model("users");

async function getUser (userId) {
    const user = await User.findOne({ "_id": userId , "IsDeleted":false});
    return user;
}


async function getUserByEmail (email) {
    const user = await User.findOne({ "email": email , "IsDeleted":false});
    return user;
}

async function registerUser(userData) {
    const user = new User(userData);
    await user.save();
}

async function userExists(email){
    const user = await User.find({email:email, IsDeleted:false}, {_id:1})
    if (user.length>0){
        return true
    }
    return false
}

function authenticateUser(email, password){
    const user = User.findOne({"email":email, "password":password, "IsDeleted":false}, {"email":1, "password":1, "role":1})
    return user
}

async function updateUser(userId, user){
    const result = User.updateOne({_id:userId},{$set:user} )
    return result
}

async function deleteUser(userId){
    const result = await User.update({_id:userId},{$set: {IsDeleted:true}})
}

module.exports={getUser, registerUser,updateUser, authenticateUser, userExists, deleteUser, getUserByEmail};
