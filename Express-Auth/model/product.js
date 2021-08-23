const mongoose = require("mongoose")

const Product = mongoose.model("product", new mongoose.Schema({
    title: String,
    price: Number
}))

module.exports = Product