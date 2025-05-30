import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register the user here
router.post("/register", async (req, res) => {
    try{
        // take out stuff from the body of the request data
        const {username, email, password} = req.body;

        // find if the user is already existing or not...
        const existing = await User.findOne({ email });

        // if existing contains something, we'll say the user that the email is already in use;
        if(existing) return res.status(400).json({error: "Email already in use"});


        // coming back to the main thing: registering the user if (s)he is new
        
        const hash = await bcrypt.hash(password, 10); // hash the password for safety
        const user = await User.create({username, email, password: hash});
        res.status(201).json({message: "User registered successfully"});
    } catch(err){
        res.status(500).json({error: "Registration failed", err});
    }
});


// Now comes the "LOGIN" part

router.post("/login", async (req, res) => {
    try{
        // extract out email and password:
        const {email , password} = req.body;

        // search for the email now;
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({error: "Email Not Registered"}); 

        // since email was fine, we compare the password;
        const valid = await bcrypt.compare(password, user.password);
        if(!valid) return res.status(400).json({error: "Invalid Passoword, Please try again"});

        // now that both are valid, let's generate the token
        const token = jwt.sign( {id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.json( { token, user: {id: user._id, username: user.username, email : user.email} });
    } catch(err){
        res.status(500).json({error: "Login Failed"});
    }
});

export default router;
