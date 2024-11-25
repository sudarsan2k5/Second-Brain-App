import jwt from "jsonwebtoken";
const JWT_SECREAT = "sudarsan2k5"
import express from "express";
const app = express();

import { UserModel } from "./db";


app.use(express.json());
app.post('/api/v1/signup', async (req, res) => {
    // make a zod validation, hash the password
    const username = req.body.username;
    const password = req.body.password;

    try{
        await UserModel.create({
            username: username,
            password: password
        });
        res.json({
            msg: "User Signed up :)"
        })
    }catch(e){
        res.status(411).json({
            message: "User already existes :)"
        })
    }

});

app.post('/api/v1/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await UserModel.findOne({
        username: username,
        password: password
    });
    if(existingUser){
        const token = jwt.sign({
             id: existingUser._id
        }, JWT_SECREAT)
        res.json({
            token: token
        })
    }else{
        res.status(403).json({
            msg: "Incorect Credential"
        })
    }
});

app.post('/api/v1/content', (req, res) => {
    const link = req.body.link;
    const title = req.body.title;
    // const 
});

app.get('/api/v1/contents', (req, res) => {

});

app.delete('/api/v1/content', (req, res) => {

});

app.post('/api/v1/brain/share', (req, res) => {

})

app.get('/api/v1/brain/:shareLink', (req, res) => {

});

app.listen(3000), () => {
    console.log("Server Listing..");
};