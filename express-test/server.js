const express = require("express")

const app = express()

//json中间件
app.use(express.json())

//连接mongodb
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/express-test", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("数据库连接成功")
}).catch(() => {
    console.log("数据库连接失败")
})

const Product = mongoose.model("Product", new mongoose.Schema({
    title: String
}))

//添加项
// Product.insertMany([{ title: "blank" }])

//解决跨域请求
app.use(require("cors")())

//静态文件托管
app.use("/", express.static("public"))

app.get("/user", function (req, res) {
    res.send([{
        user: "blank",
        passwrod: "zro"
    }])
})

//产品列表
app.get("/products", async function (req, res) {
    //分页处理
    // res.send(await Product.find().skip(2).limit(1))
    //排序
    res.send(await Product.find().sort({ _id: 1 }))
})

//产品详情
app.get("/products/:id", async function (req, res) {

    res.send(await Product.findById(req.params.id))
})

//添加产品
app.post("/products", async function (req, res) {
    const data = req.body
    const product = await Product.create(data)
    res.send(product)
})

//编辑产品
app.put("/products/:id", async function (req, res) {
    const product = await Product.findById(req.params.id)
    product.title = req.body.title
    await product.save()
    res.send(product)
})

//删除产品
app.delete("/products/:id", async function (req, res) {
    const product = await Product.findById(req.params.id)
    await product.delete()
    res.send({
        success: true
    })
})


app.listen(3000, () => {
    console.log("3000")
})