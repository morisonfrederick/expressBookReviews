const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  return users.find((user) => {
    return user.userName === username && user.password === password;
  });
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  let { userName, password } = req.body;
  if (!userName || !password) {
    return res
      .status(400)
      .json({ message: "please provide user name and/or password" });
  }
  const userExist = users.find((user) => {
    return user.userName === userName;
  });
  if (!userExist) {
    return res
      .status(400)
      .json({ message: "user with provided username is not found" });
  }
  if (authenticatedUser(userName, password)) {
    let token = jwt.sign({ data: password }, "secret", { expiresIn: 60 * 60 });
    req.session.autherization = { token, userName };
    return res.status(200).json({ message: "user autherized successfully" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log("inside post auth/review/:isbn");

  const isbn = req.params.isbn;
  const { review } = req.body;
  const user = req.user;

  if (!review) {
    return res.status(400).json({ message: "provide a valid review" });
  }
  //Write your code here

  books[isbn].reviews[user] = review;
  console.log(books[isbn].review);

  return res.status(200).json({ message: "review added" });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let user = req.user;
  delete books[isbn].reviews[user];

  res.status(200).json({ message: "review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
