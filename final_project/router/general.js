const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here

  let { userName, password } = req.body;
  if (!userName) {
    return res
      .status(400)
      .json({ message: "please provide a valid user name" });
  }
  if (!password) {
    return res.status(400).json({ message: "please provide a valid password" });
  }
  const userExist = users.find((user) => {
    return user.userName === userName;
  });

  if (userExist) {
    return res.status(400).json({ message: "user exist with same user name" });
  } else {
    users.push({ userName, password });
    return res.status(200).json({ message: "user added successfully" });
  }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let newbooks = books;
      resolve(newbooks);
    }, 6000);
  });

  try {
    let jsonBooks = await myPromise.then((book) => {
      return book;
    });
    if (jsonBooks) {
      return res.status(200).json(jsonBooks);
    } else {
      return res.status(400).json({ message: "books not loading properly" });
    }
  } catch (error) {
    return res.status(500).json({ message: "internal server errro", error });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let newbooks = books;
      resolve(newbooks);
    }, 6000);
  });

  try {
    let isbn = req.params.isbn;
    let out = await myPromise.then((book) => {
      return book[isbn];
    });
    if (!out) {
      return res.status(400).json({ message: "book not found" });
    } else {
      return res.status(200).json(out);
    }
  } catch (error) {
    return res.status(500).json({ message: "internal server errro", error });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let newbooks = books;
      resolve(newbooks);
    }, 6000);
  });

  try {
    let autherName = req.params.author;
    let newBooks = await myPromise.then((book) => book);
    const bookFound = Object.values(newBooks).find((book) => {
      return book.author === autherName;
    });
    if (!bookFound) {
      return res.status(300).json({ message: "author not found" });
    } else {
      return res.status(200).json(bookFound);
    }
  } catch (error) {
    return res.status(500).json({ message: "internal server errro", error });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let newbooks = books;
      resolve(newbooks);
    }, 6000);
  });

  try {
    let titleInput = req.params.title;
    let newBooks = await myPromise.then((book) => book);

    let bookFound = Object.values(newBooks).find((book) => {
      return book.title === titleInput;
    });

    if (!bookFound) {
      return res.status(400).json({ message: "book not found" });
    } else {
      return res.status(200).json(bookFound);
    }
  } catch (error) {
    return res.status(500).json({ message: "internal server errro", error });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
