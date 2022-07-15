const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET books listing. */
router.get('/', asyncHandler(async(req, res) => {
  const books = await Book.findAll();
  res.render("index", { books, title: "Books" });
  
}));

/* Create a new book form. */
router.get('/new_book', (req, res) => {
  res.render("new_book", { book: {}, title: "New Book" });
});

/* POST create a book. */
router.post('/new_book', asyncHandler(async (req, res) => {
  res.redirect("/")
}));


/* Edit book form. */
router.get("/:id/update-book", asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render("/update-book", { book, title: book.title})
}));

/* Update a book. */
router.post('/:id/update-book', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect("/");
}));





module.exports = router;