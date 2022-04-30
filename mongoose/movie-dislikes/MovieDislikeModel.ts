/**
 * @file Implements mongoose model to CRUD
 * documents in the likes collection
 */
import mongoose from "mongoose";
import MovieDisLikeSchema from "./MovieDislikeSchema";
const MovieDisLikeModel = mongoose.model("MovieDisLikeModel", MovieDisLikeSchema);
export default MovieDisLikeModel;