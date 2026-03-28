import express, { json } from 'express'; 
import mongoose from "mongoose";
import dotenv from 'dotenv';
import connectDB from './mongo_conn.js';
import Score from './models/score.js';
import cors from 'cors';
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const authenticationToken = (req,res,next) =>{
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.status(401).json({message: "Access Denied"});
    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();

    }catch(error){
        res.status(400).json({message: "Invalid Token"});
    }
}


app.get('/', (req, res) => {
    res.send("dinooooo");
})

app.post('/score', authenticationToken, async (req, res) => {
    try{
       const playerName = req.user.username;
       const {score}= req.body;
       const existingScore = await Score.findOne({playerName})
       if(existingScore){
        if(score > existingScore.score){
            existingScore.score = score;
            await existingScore.save();
            return res.status(200).json({message: "Score updated successfully!"});
        }
        else{
            return res.status(200).json({message: "Score not updated"});
        }
       }
       else{
        const newScore = new Score({playerName, score});
        await newScore.save();
        return res.status(200).json({message: "Score saved successfully!"});
       }
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Failed to save score"});
    }
});
app.get('/leaderboard', async (req,res) =>{
    try{
        const topPlayers = await Score.find().sort({score:-1}).limit(10);
        res.status(200).json(topPlayers);
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Failed to fetch leaderboard"});
    }
})
app.post('/register', async (req,res) =>{
    try{
        const {username, password} = req.body;
        const existingUser = await User.findOne({username: username});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username: username, password: hashedPassword });
        await newUser.save();
        res.status(200).json({message: "User registered successfully!"});
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Failed to register user"});
    }
})

app.post('/login', async (req,res) =>{
    try{
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        return res.status(400).json({message: " username or passwordInvaild"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({message: "username or passwordInvaild"});
    }
    const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET, {expiresIn: '24h'});
    res.status(200).json({message: "Login successful!", token});
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Failed to login"});
    }

})


connectDB()
    .then(() => {

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }).catch((error) => {
        console.log(error);
        process.exit(1);
    });

