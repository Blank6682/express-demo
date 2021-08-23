const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },//名字唯一
    password: {
        type: String,
        //密码加密
        set (val) {
            return require("bcrypt").hashSync(val, 10)
        }
    }
})
const User = mongoose.model("user", UserSchema)

module.exports = User