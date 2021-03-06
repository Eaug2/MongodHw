import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },
    note:{
        type: Schema.Types.ObjectId,
        ref:"Note"
    }
});

export const Article = mongoose.model("article", ArticleSchema);