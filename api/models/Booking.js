const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    place: {type:mongoose.Schema.Types.ObjectId, required:true},
    user: {type:mongoose.Schema.Types.ObjectId, required:true},
    checkIn: {type:Date, requried:true},
    checkOut: {type:Date, requried:true},
    name: {type:String, requried:true},
    phone: {type:String, requried:true},
    price: Number
})

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel