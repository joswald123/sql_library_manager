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
router.get('/books', asyncHandler(async(req, res) => {
  const books = await Book.findAll();
  if(books) {
    res.render("index", { books });
  } else {
    res.sendStatus(404);
  }

}));

/* Create a new book form. */
router.get('/books/new', (req, res) => {
  res.render("new_book", { book: {}, title: "" });
});

/* POST create a book. */
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    await Book.create(req.body)
    res.redirect("/")
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("new_book", { book, errors: error.errors, title: "" })
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }
  }
  
}));

/* Edit book form. */
router.get("/books/:id", asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("update-book", { book, title: book.title})
  } else {
    res.render("page-not-found")
  }
  
}));

/* Update a book. */
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/");
    } else {
      res.render("page-not-found");
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("update-book", { book, errors: error.errors, title: "Update Book" })
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }
  }
  
}));

/* Delete book form. */
router.get("/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("update-book", { book, title: "Delete Book" });
  } else {
    res.render("page-not-found");
  }
}));

/* Delete individual book. */
router.post('/books/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  console.log(req.params.id)
  if(book) {
    await book.destroy();
    res.redirect("/");
  } else {
    res.render("page-not-found");
  }
  
}));


module.exports = router;