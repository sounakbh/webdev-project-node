import MovieLike from "../models/movie-likes/MovieLike";

/**
 * @file Declares API for Likes related data access object methods
 */
export default interface MovieLikeDaoI {
    findAllUsersThatLikedMovie (mid: string): Promise<MovieLike[]>;
    findAllMoviesLikedByUser (uid: string): Promise<MovieLike[]>;
    userUnlikesMovie (mid: string, uid: string): Promise<any>;
    userLikesMovie (mid: string, uid: string): Promise<MovieLike>;
};