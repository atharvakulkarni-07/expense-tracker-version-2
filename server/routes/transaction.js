import express from "express";
import Transaction from "../models/Transaction.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create POST request; (creating a new transaction)
router.post('/', auth, async (req,res) => {
    try{
        console.log("🔍 Request body received:", req.body); // Debug line
        const {product, amount, category, type, description, paymentMethod, status} = req.body;
        
        console.log("🔍 Extracted fields:", {product, amount, category, type}); // Debug line

        const transaction = await Transaction.create({
            user: req.user.id,
            product,           
            amount,
            category,
            type,
            description,
            paymentMethod,
            status: status || 'cleared',
            date: req.body.date || Date.now()
        });

        res.status(201).json(transaction);
    }catch(err){
        console.error("❌ Backend error:", err.message); // Debug line
        console.error("❌ Full error:", err); // Debug line
        res.status(400).json({ error: "Transaction creation failed!", details: err.message});
    }
}); 


// Create a GET request; (getting all transactions)
router.get('/', auth, async(req,res) => {
    try{
        const transactions = await Transaction.find({ user: req.user.id}).sort({date: -1}); // newest transactions first;

        res.json(transactions);
    }catch(err){
        res.status(500).json({error: "Failed to fetch transactions!"});
    }
});

// Create a PUT request; (updating the transactions)
router.put('/:id', auth, async(req,res) => {
    try{
        const updated = await Transaction.findOneAndUpdate(
            {_id: req.params.id, user: req.user.id},
            req.body,
            { new: true, runValidators: true}
        );

        if(!updated){
            return res.status(404).json({error: "Transaction not found!"});
        }
        res.json(updated); // this line is essential so that the PUT request gives us the response after testing is done.

    }catch(err){
        res.status(400).json({ error: "Update failed", details: err.message, err });
    }
});

// Create a DELETE request; (deleting the transactions)
router.delete('/:id', auth, async(req,res) => {
    try{
        const transaction = await Transaction.findOneAndDelete(
            {
                _id: req.params.id,
                user: req.user.id
            }
        );

        // if the transaction is not found
        if(!transaction){
            return res.status(404).json({error: "Transaction not found"});
        }

        //  if the deletion works: Here we can't pass the deleted object, so we need to pass an object like 'success';
        res.json({ success: true });

    }catch(err){
        res.status(400).json({ error: "Deletion failed", details: err.message, err });
    }
});


export default router;