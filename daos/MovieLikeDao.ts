import MovieLike from "../models/movie-likes/MovieLike";
import MovieLikeDaoI from "../interfaces/MovieLikeDaoI";
import MovieLikeModel from "../mongoose/movie-likes/MovieLikeModel";

export default class MovieLikeDao implements MovieLikeDaoI {
    private static movieLikeDao: MovieLikeDao | null = null;
    public static getInstance = (): MovieLikeDao => {
        if(MovieLikeDao.movieLikeDao === null) {
            MovieLikeDao.movieLikeDao = new MovieLikeDao();
        }
        return MovieLikeDao.movieLikeDao;
    }
    private constructor() {}
    findAllUsersThatLikedMovie = async (mid: string): Promise<MovieLike[]> =>
        MovieLikeModel
            .find({movie: mid})
            .populate("likedBy")
            .exec();
    findAllMoviesLikedByUser = async (uid: string): Promise<MovieLike[]> =>
        MovieLikeModel
            .find({likedBy: uid});
    userLikesMovie = async (uid: string, mid: string): Promise<any> =>
        MovieLikeModel.create({movie: mid, likedBy: uid});
    findUserLikesMovie = async (uid: string, mid: string): Promise<any> =>
        MovieLikeModel.findOne({movie: mid, likedBy: uid});
    userUnlikesMovie = async (uid: string, mid: string): Promise<any> =>
        MovieLikeModel.deleteOne({movie: mid, likedBy: uid});
    countHowManyLikedMovie = async (mid: string): Promise<any> =>
        MovieLikeModel.count({movie: mid});
}