import BookmarkDao from "../daos/BookmarkDao";
import Bookmark from "../models/bookmarks/Bookmark";
import {Express, Request, Response} from "express";
import BookmarkControllerI from "../interfaces/BookmarkControllerI";

export default class BookmarkController implements BookmarkControllerI {

    private static bookmarkDao: BookmarkDao = BookmarkDao.getInstance();
    private static bookmarkController: BookmarkController | null = null;

    public static getInstance = (app: Express): BookmarkController => {
        if (BookmarkController.bookmarkController === null) {
            BookmarkController.bookmarkController = new BookmarkController();
            app.post("/api/bookmarks", BookmarkController.bookmarkController.addBookmark);
            app.delete("/api/bookmarks/:uid/:movieId", BookmarkController.bookmarkController.deleteBookmark);
            app.get("/api/bookmarks/:uid", BookmarkController.bookmarkController.findAllBookmarksForUser);

        }
        return BookmarkController.bookmarkController;
    }


    addBookmark(req: Request, res: Response) {
        // @ts-ignore
        // @ts-ignore
        let userId = req.body.userId ===  req.session['profile'].username?
            // @ts-ignore
            req.session['profile'].username : null;

        if (userId === null) {
            res.status(503).send("User needs to be logged")
            return;
        }

        if(!req.body.userId || !req.body.movieId){
            return res.status(503).send("Cannot be empty");
        }

        BookmarkController.bookmarkDao.findMovieForUser(userId, req.body.movieId).then(result => {
            if (!result) {
                BookmarkController.bookmarkDao.addBookmark(req.body.userId, req.body.movieId)
                    .then((bookmark: Bookmark) => res.json(bookmark));
            } else {
                res.status(503).send("Error duplicate bookmark");
            }
        })
    }

    deleteBookmark(req: Request, res: Response) {
        // @ts-ignore
        let userId = req.params.uid ===  req.session['profile'].username?
            // @ts-ignore
            req.session['profile'].username : null;

        if (userId === null) {
            res.status(503).send("User needs to be logged")
            return;
        }
        BookmarkController.bookmarkDao.deleteBookmark(userId, req.params.movieId)
            .then((status) => res.send(status));
    }

    findAllBookmarksForUser(req: Request, res: Response) {
        // @ts-ignore
        let userId = req.params.uid ===  req.session['profile'].username?
            // @ts-ignore
            req.session['profile'].username : null;

        if (userId === null) {
            res.status(503).send("User needs to be logged")
            return;
        }
        BookmarkController.bookmarkDao.findAllBookmarksForUser(userId)
            .then((bookmarks: Bookmark[]) => res.json(bookmarks.map(value => value.movieId)))
    }

}