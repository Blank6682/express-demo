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

//查出所有关联的表数据
const CategorySchema = new mongoose.Schema({
    name: { type: String }
}, {
    toJson: { virtual: true }
})

//建立虚拟表关联
CategorySchema.virtual("posts", {
    localField: "_id",//本地哪个键关联
    ref: "Post",
    foreignField: "categories",//外联哪个字段
    justOne: false,
})

const Category = mongoose.model("Category", CategorySchema)


const Post = mongoose.model("Post", new mongoose.Schema({
    title: { type: String },
    body: { type: String },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "Category" },
    categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Category" }]
}))


async function CreateCategory () {
    //添加多项到DB
    await Category.insertMany([{
        name: "科技"
    }, {
        name: "生活"
    }])
    const category = await Category.find()
    console.log(category)
}

async function main () {
    const cats = await Category.find().populate("posts").lean()
    console.log(cats[0])

    //添加多条数据到DB
    // await Post.insertMany([{
    //     title: "blank1",
    //     body: "描述1"
    // }, {
    //     title: "blank2",
    //     body: "描述2"
    // }])

    //进行表关联
    // const cat1 = await Category.findOne({ name: "科技" })
    // const cat2 = await Category.findOne({ name: "生活" })
    // const post1 = await Post.findOne({ title: "blank1" })
    // const post2 = await Post.findOne({ title: "blank2" })

    // post1.category = cat1
    // post1.categories = [cat1, cat2]

    // post2.category = cat2
    // post2.categories = [cat2]
    // await post1.save()
    // await post2.save()

    // const posts = await Post.find().populate('categories')
    // console.log(posts[0], posts[1])
}

main()
// CreateCategory()


