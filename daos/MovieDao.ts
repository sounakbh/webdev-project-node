/**
 * @file Implements DAO managing data storage of tuits. Uses mongoose MovieModel
 * to integrate with MongoDB
 */
import MovieDaoI from "../interfaces/MovieDaoI";
import MovieModel from "../mongoose/movies/MovieModel";
import Movie from "../models/movies/Movie";

/**
 * @class MovieDao Implements Data Access Object managing data storage
 * of Users
 * @property {MovieDao} movieDao Private single instance of UserDao
 */
export default class MovieDao implements MovieDaoI{
    private static movieDao: MovieDao | null = null;
    public static getInstance = (): MovieDao => {
        if(MovieDao.movieDao === null) {
            MovieDao.movieDao = new MovieDao();
        }
        return MovieDao.movieDao;
    }
    private constructor() {}
    findAllMovies = async (): Promise<Movie[]> =>
        MovieModel.find();
    findMovieById = async (mid: string): Promise<any> =>
        MovieModel.findById(mid);
    findMovieByOmdbId = async (movieId: string): Promise<any> =>
        MovieModel.findOne({movieId: movieId});
    createMovie = async (movie: Movie): Promise<Movie> =>
        MovieModel.create({...movie});
    updateMovie = async (mid: string, movie: Movie): Promise<any> =>
        MovieModel.updateOne(
            {_id: mid},
            {$set: movie});
    updateLikes = async (mid: string, newStats: any): Promise<any> =>
        MovieModel.updateOne(
            {_id: mid},
            {$set: {stats: newStats}}
        );
    deleteMovie = async (mid: string): Promise<any> =>
        MovieModel.deleteOne({_id: mid});
    findMostLikedMovies = async (numMovies: number): Promise<any> =>
        MovieModel.find().sort({'stats.likes': -1}).limit(numMovies);
    findMostDislikedMovies = async (numMovies: number): Promise<any> =>
        MovieModel.find().sort({'stats.dislikes': -1}).limit(numMovies);
}