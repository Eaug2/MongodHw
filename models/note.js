import mongoose from "mongoose";

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    title: String,
    body: String
});

export const Note = mongoose.model("note", NoteSchema);