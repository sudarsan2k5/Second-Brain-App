import mongoose, { model, Schema } from "mongoose";


// database url
mongoose.connect("mongodb+srv://sudarsan2k5:admin2k5@cluster0.qmp3n.mongodb.net/brain");

const userSchema = new mongoose.Schema({
    username: {type: String, require: true, unique: true}, 
    password: {type: String, require: true}
});
export const UserModel = model("User", userSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
});
export const ContentModel = model("Content", ContentSchema);
