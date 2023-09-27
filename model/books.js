const { Decimal128 } = require('bson');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name:String,
    price:String,
    availability:String,
    rating:String
})


const Book = mongoose.model('Book', bookSchema);
module.exports = Book;