import BookmarkDaoI from "../interfaces/BookmarkDaoI";
import Bookmark from "../models/bookmarks/Bookmark";
import BookmarkModel from "../mongoose/bookmark/BookmarkModel";


export default class BookmarkDao implements BookmarkDaoI {
    private static bookmarkDao: BookmarkDao | null = null;

    public static getInstance = (): BookmarkDao => {
        if(BookmarkDao.bookmarkDao === null) {
            BookmarkDao.bookmarkDao = new BookmarkDao();
        }
        return BookmarkDao.bookmarkDao;
    }


    addBookmark = async (userId: string, movieId: string): Promise<Bookmark> => {
        return BookmarkModel.create({userId, movieId});
    }

    deleteBookmark = async (userId: string, movieId: string): Promise<any> =>  {
        return BookmarkModel.deleteOne({userId, movieId})
    }

    findAllBookmarksForUser = async (userId: string): Promise<Bookmark[]> => {
        return BookmarkModel.find({userId});

    }

    findMovieForUser = async  (userId: string, movieId: string): Promise<boolean> => {
        // @ts-ignore
        return BookmarkModel.exists({userId, movieId});
    }

}