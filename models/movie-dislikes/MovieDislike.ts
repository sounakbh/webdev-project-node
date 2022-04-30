/**
 * @file Declares MovieDislike data type representing relationship between
 * users and movies, as in user dislikes a movie
 */
import Movie from "../movies/Movie";
import User from "../users/User";

/**
 * @typedef MovieDislike Represents dislikes relationship between a user and a movie,
 * as in a user dislikes a movie
 * @property {Movie} movie Movie being disliked
 * @property {User} dislikedBy User disliking the movie
 */

export default interface MovieDislike {
    movie: Movie,
    dislikedBy: User
};