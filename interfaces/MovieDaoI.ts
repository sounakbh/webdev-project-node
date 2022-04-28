import Movie from "../models/movies/Movie";
/**
 * @file Declares API for Movies related data access object methods
 */
export default interface MovieDaoI {
    findAllMovies (): Promise<Movie[]>;
    findMovieById (mid: string): Promise<Movie>;
    findMovieByOmdbId (movieId: string): Promise<Movie>;
    createMovie (movieId: Movie): Promise<Movie>;
    updateMovie (mid: string, movieId: Movie): Promise<any>;
    deleteMovie (mid: string): Promise<any>;
};