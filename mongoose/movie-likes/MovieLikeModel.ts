/**
 * @file Implements mongoose model to CRUD
 * documents in the likes collection
 */
import mongoose from "mongoose";
import MovieLikeSchema from "./MovieLikeSchema";
const MovieLikeModel = mongoose.model("MovieLikeModel", MovieLikeSchema);
export default MovieLikeModel;