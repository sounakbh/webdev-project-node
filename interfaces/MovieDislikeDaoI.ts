import MovieDislike from "../models/movie-dislikes/MovieDislike";

/**
 * @file Declares API for Dislikes related data access object methods
 */
export default interface MovieDislikeDaoI {
    findAllUsersThatDislikedMovie (mid: string): Promise<MovieDislike[]>;
    findAllMoviesDislikedByUser (uid: string): Promise<MovieDislike[]>;
    userRemovesDislikesMovie (mid: string, uid: string): Promise<any>;
    userDislikesMovie (mid: string, uid: string): Promise<MovieDislike>;
};