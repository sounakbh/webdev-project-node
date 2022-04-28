import mongoose, {Schema} from "mongoose";
import MovieLike from "../../models/movie-likes/MovieLike";

const MovieLikeSchema = new mongoose.Schema<MovieLike>({
    movie: {type: Schema.Types.ObjectId, ref: "MovieModel"},
    likedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
}, {collection: "movieLikes"});
export default MovieLikeSchema;