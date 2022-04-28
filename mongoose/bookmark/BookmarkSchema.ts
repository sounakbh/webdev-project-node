import mongoose from "mongoose";
import Bookmark from "../../models/bookmarks/Bookmark";

const BookmarkSchema = new mongoose.Schema<Bookmark>(
    {
        userId: {type: String, required: true},
        movieId: {type: String, required: true}
    }
)

export default BookmarkSchema;