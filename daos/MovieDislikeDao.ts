import MovieDislike from "../models/movie-dislikes/MovieDislike";
import MovieDislikeDaoI from "../interfaces/MovieDislikeDaoI";
import MovieDisLikeModel from "../mongoose/movie-dislikes/MovieDisLikeModel";

export default class MovieDislikeDao implements MovieDislikeDaoI {
    private static movieDislikeDao: MovieDislikeDao | null = null;
    public static getInstance = (): MovieDislikeDao => {
        if(MovieDislikeDao.movieDislikeDao === null) {
            MovieDislikeDao.movieDislikeDao = new MovieDislikeDao();
        }
        return MovieDislikeDao.movieDislikeDao;
    }
    private constructor() {}
    findAllUsersThatDislikedMovie = async (mid: string): Promise<MovieDislike[]> =>
        MovieDisLikeModel
            .find({movie: mid})
            .populate("dislikedBy")
            .exec();
    findAllMoviesDislikedByUser = async (uid: string): Promise<MovieDislike[]> =>
        MovieDisLikeModel
            .find({dislikedBy: uid})
            .populate("movie")
            .exec();
    userDislikesMovie = async (uid: string, mid: string): Promise<any> =>
        MovieDisLikeModel.create({movie: mid, dislikedBy: uid});
    findUserDislikesMovie = async (uid: string, mid: string): Promise<any> =>
        MovieDisLikeModel.findOne({movie: mid, dislikedBy: uid});
    userRemovesDislikesMovie = async (uid: string, mid: string): Promise<any> =>
        MovieDisLikeModel.deleteOne({movie: mid, dislikedBy: uid});
    countHowManyDislikedMovie = async (mid: string): Promise<any> =>
        MovieDisLikeModel.count({movie: mid});
}