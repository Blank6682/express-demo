const express = require("express")

const mongoose = require("mongoose")

const User = require('./model/user');

const jwt = require("jsonwebtoken")

const app = express()

app.use(express.json())

//密钥
const SECTRET = "SSSFSDFEWRGFSDGBSEWEGSAGF"

const auth = async (req, res, next) => {
    //请求头的token
    const raw = String(req.headers.authorization).split(" ").pop()
    const { id } = jwt.verify(raw, SECTRET)
    req.user = await User.findById(id)
    next()
}
//连接数据库
mongoose.connect("mongodb://localhost:27017/express-test", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Success")
}).catch(() => {
    console.log("Error!")
})


//API
//主页
app.use("/", express.static("public"))

//注册
app.post("/register", async (req, res) => {
    const user = await User.create(req.body)
    res.send(user)
})

//登录
app.post("/login", async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    })
    if (!user) {
        return res.status(422).send({
            message: "用户名不存在"
        })
    }
    const isPasswordValid = require("bcrypt").compareSync(req.body.password, user.password)

    if (!isPasswordValid) {
        return res.status(422).send({
            message: "密码不正确"
        })
    }

    const token = jwt.sign({
        id: String(user._id)
    }, SECTRET)
    res.send({
        user,
        token
    })
})

app.get("/profile", auth, async (req, res) => {

    res.send(req.user)
})

//用户列表
app.get("/user", async (req, res) => {
    const user = await User.find()
    res.send(user)
})

//编辑
app.put("/user/:id", auth, async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        username: req.body.username,
        password: req.body.password
    }, (err, docs) => {
        if (err) {
            console.log("Success")
        } else (
            console.log("Error")
        )
    })
    res.send(user)
})

//删除
app.delete("/user/delete", auth, async (req, res) => {
    await User.findByIdAndDelete(req.user._id).then(() => {
        res.send("Success")
    }).catch(() => {
        res.send("Error")
    })
})

app.listen(3001, () => {
    console.log("3001")
})