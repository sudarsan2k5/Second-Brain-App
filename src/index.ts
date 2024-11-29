import jwt from "jsonwebtoken";
import { JWT_SECREAT } from "./config";
import express from "express";
import { userMiddleware } from "./middleware";
const app = express();

import { ContentModel, LinkModel, UserModel } from "./db";
import { random } from "./utils";

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

app.post('/api/v1/content', userMiddleware, (req, res) => {
    const link = req.body.link;
    const type = req.body.title;
    ContentModel.create({
        link: link,
        type: type,
        //@ts-ignore
        userId: req.userId,
        tags: []
    })
    res.json({
        msg: "Content added"
    })
});

app.get('/api/v1/contents', userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username")
    res.json({
        content
    })
});

app.delete('/api/v1/content', userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;

    await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId: req.userId
    })

    res.json({
        message: "Deleted Content :("
    })
});


app.post('/api/v1/brain/share', userMiddleware, async (req, res) => {
    const share = req.body.share;
    if(share){
        await LinkModel.create({
            //userId: req.userId,
            userId: (req as any).userId,
            hash: random(10)
        });
    }else{
        await LinkModel.deleteOne({
            // userId: req.userId//-
            userId: (req as any).userId
        })
    }

    res.json({
        message: "Updated Shared Link"
    })
})

app.get('/api/v1/brain/:shareLink', (req, res) => {

});

app.listen(3000), () => {
    console.log("Server Listing..");
};