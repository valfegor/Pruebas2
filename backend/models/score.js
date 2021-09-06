const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
    user: String,
    RealScore:Number,
    dbStatus: Boolean,
    date: { type: Date, default: Date.now },
})


const score = mongoose.model('score',scoreSchema);

module.exports = score;