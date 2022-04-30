import mongoose, {Schema} from "mongoose";
import MovieDislike from "../../models/movie-dislikes/MovieDislike";

const MovieDisLikeSchema = new mongoose.Schema<MovieDislike>({
    movie: {type: Schema.Types.ObjectId, ref: "MovieModel"},
    dislikedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
}, {collection: "movieDislikes"});
export default MovieDisLikeSchema;