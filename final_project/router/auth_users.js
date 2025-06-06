const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
// Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
};

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
// Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/reviews/:isbn", (req, res) => {
  const bookId = req.params.isbn;
  const username = req.user.username; // Assuming req.user contains logged-in user's info
  const review = req.body.review; // Assuming review text is sent in request body

  // Check if the book exists
  if (books[bookId]) {
    // Initialize reviews object if not present
    if (!books[bookId].reviews) {
      books[bookId].reviews = {};
    }
    // Save or update the review for the logged-in user
    books[bookId].reviews[username] = review;

    res.send(`Your review has been added/updated.`);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

regd_users.get('/auth/reviews/:isbn', (req, res) => {
  const bookId = req.params.isbn;
  const username = req.user.username;

  if (books[bookId]) {
    const review = books[bookId].reviews ? books[bookId].reviews[username] : null;
    if (review) {
      res.status(200).json({ review: review }); // singular "review"
    } else {
      res.status(404).json({ message: "No review found for this user." });
    }
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Delete review
regd_users.delete('/auth/reviews/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const username = req.user.username; // Assuming authentication middleware sets req.user

  if (books[isbn]) {
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found for user" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
