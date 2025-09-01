import mongoose, { mongo } from "mongoose";

const transactionSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    product: {type: String, trim: true},
    category: {type: String, required: true},
    amount: {type: Number, required: true},
    type: {type: String, enum: ["income", "expense"], required: true},
    date: {type: Date, required: true},
    description: {type: String, maxlength: 100},
    paymentMethod: {type: String, maxlength: 30},
    receipt: {type: String},
    status: {type: String, enum: ["pending", "cleared", "recurring"], default: "cleared"}
}, {timestamps: true});


export default mongoose.model("Transaction", transactionSchema);