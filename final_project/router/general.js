const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
   res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const results = [];

    // Loop through each book to find matching author
    for (const key in books) {
        if (books[key].author.toLowerCase() === author) {
            results.push({ id: key, ...books[key] });
        }
    }

    if (results.length > 0) {
        res.status(200).json({ books: results });
    } else {
        res.status(404).json({ message: "No books found by that author." });
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
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
