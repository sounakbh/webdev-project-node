/**
 * @file Declares MovieLike data type representing relationship between
 * users and movies, as in user likes a movie
 */
import Movie from "../movies/Movie";
import User from "../users/User";

/**
 * @typedef MovieLike Represents likes relationship between a user and a movie,
 * as in a user likes a movie
 * @property {Movie} movie Movie being liked
 * @property {User} likedBy User liking the movie
 */

export default interface MovieLike {
    movie: Movie,
    likedBy: User
};