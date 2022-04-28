import Bookmark from "../models/bookmarks/Bookmark";


export default interface BookmarkDaoI {
    findAllBookmarksForUser(userId: string) : Promise<Bookmark[]>,
    addBookmark(userId: string, movieId: string): Promise<Bookmark>,
    deleteBookmark(userId: string, movieId: string): void,
    findMovieForUser(userId:string, movieId: string) : Promise<boolean>
}