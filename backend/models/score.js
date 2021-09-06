const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
    name: String,
    users: Array,
    RealScore:Array,
    pt_propuesto:Number,
    dbStatus: Boolean,
    date: { type: Date, default: Date.now },
    task_id:{ type: mongoose.Schema.ObjectId, ref: "task" },
    tasks_ids:Array,

})


const score = mongoose.model('score',scoreSchema);

module.exports = score;