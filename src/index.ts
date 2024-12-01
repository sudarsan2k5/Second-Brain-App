import jwt from "jsonwebtoken";
import { JWT_SECREAT } from "./config";
import express from "express";
import cors from 'cors'
import { userMiddleware } from "./middleware";
const app = express();

import { ContentModel, LinkModel, UserModel } from "./db";
import { random } from "./utils";

app.use(express.json());
app.use(cors())
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
        const existingLink = await LinkModel.findOne({
            userId: (req as any).userId
        });

        if(existingLink){
            res.json({
                hash: existingLink
            })
            return;
        }
        const hash = random(10)
        await LinkModel.create({
            userId: (req as any).userId,
            hash: hash
        });
        res.json({
            hash
        })
    }else{
        await LinkModel.deleteOne({
            userId: (req as any).userId
        });
        res.json({
            message: "Removed Links"
        })
    }
})

app.get('/api/v1/brain/:shareLink', async (req, res) => {
    const hash = req.params.shareLink;

    const links = await LinkModel.find({
        hash
    });

    if(!links || links.length === 0){
        res.status(411).json({
            message: "Sorry Incorrect Inputs :("
        })
        return
    }

    const link = links[0];
    
    const content = await ContentModel.findOne({
        userId: link.userId
    })

    const user = await UserModel.findOne({
        _id: link.userId
    })
    res.json({
        username: user?.username,
        content: content
    })
});

app.listen(3000), () => {
    console.log("Server Listing..");
};