const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books', error });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
 });

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();

    try {
        // Find books by the specified author
        const results = Object.entries(books)
            .filter(([key, book]) => book.author.toLowerCase() === author)
            .map(([key, book]) => ({ id: key, ...book }));

        if (results.length > 0) {
            res.status(200).json({ books: results });
        } else {
            res.status(404).json({ message: "No books found by that author." });
        }
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "An error occurred while processing your request." });
    }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const results = [];

    // Loop through each book to find matching title
    for (const key in books) {
        if (books[key].title.toLowerCase() === title) {
            results.push({ id: key, ...books[key] });
        }
    }

    if (results.length > 0) {
        res.status(200).json({ books: results });
    } else {
        res.status(404).json({ message: "No books found by that title." });
    }
});


//  Get book review
public_users.get('/reviews/:isbn', function (req, res) {
    const bookId = req.params.isbn;

    // Check if the book exists
    if (books[bookId]) {
        const reviews = books[bookId].reviews;
        res.status(200).json({ reviews: reviews });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});


module.exports.general = public_users;
