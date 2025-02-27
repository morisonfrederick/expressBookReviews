const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  console.log("user auth is called");

  //Write the authenication mechanism here
  if (req.session.autherization) {
    console.log("inside first loop");

    let token = req.session.autherization["token"];
    if (token) {
      console.log("token found");

      jwt.verify(token, "secret", (err, user) => {
        if (!err) {
          req.user = user;
          next();
        } else {
          return res.status(403).json("user not authenticated");
        }
      });
    } else {
      return res.status(400).json("token not found");
    }
  } else {
    return res.status(400).json({ message: "token not found on session" });
  }

  //verify token
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
