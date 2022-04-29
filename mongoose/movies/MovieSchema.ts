import mongoose, { Schema } from "mongoose";
import Movie from "../../models/movies/Movie";

const MovieSchema = new mongoose.Schema<Movie>(
  {
    movieId: { type: String, required: true },
    stats: {
      likes: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 },
    },
  },
  { collection: "movies" }
);
export default MovieSchema;
