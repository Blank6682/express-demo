const User = require('./model/user');

//注册
app.post("/register", async (req, res) => {
    const user = await User.create(req.body)
    res.send(user)
})

//登录
app.post("/login", async (req, res) => {
    const user = await User.findOne(req.body)
    res.send(user)
})

//用户列表
app.get("/user", async (req, res) => {
    const user = await User.find()
    res.send(user)
})

//编辑
app.put("/user/:id", async (req, res) => {
    const user = await User.findById(req.params.id)
    user.username = req.body.username
    user.password = req.body.password
    await user.save()
    res.send(user)
})

//删除
app.delete("/user/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id).then(() => {
        res.send("Success")
    }).catch(() => {
        res.send("Error")
    })
})
