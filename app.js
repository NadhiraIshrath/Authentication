const { Passport } = require("passport");

var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
mongoose.connect('mongodb+srv://Nadhira:nadhi_134@cluster0-rvthp.mongodb.net/trash?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
//  mongoose.connect('mongodb+srv://Nadhira:nadhi_134@cluster0-cyeqp.mongodb.net/dogs?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
// app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("express-session")({
    secret: "A simple job",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.use(express.static("public"));
// var blogschema = new mongoose.Schema({
//     title: String,
//     image: String,
//     body: String,
//     created: { type: Date, default: Date.now }
// });
// var Blog = mongoose.model("Blog", blogschema);
// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1532692966749-619e0feb9e78?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjYxNTE4fQ&auto=format&fit=crop&w=700&q=80",
//     body: "Milkyway",

// });
app.get("/", function(req, res) {
    res.render("home");
});
app.get("/secret", isLoggedIn, function(req, res) {
    res.render("secret");
});
//sign up 
app.get("/register", function(req, res) {
    res.render("register");
});
//sign up logic
app.post("/register", function(req, res) {
    // res.send("REGISTER POST ROUTE");
    // req.body.username;
    // req.body.password;
    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/secret");

        });
    });
});
app.get("/login", function(req, res) {
    res.render("login");
});
//login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res) {

});
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");

});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
app.listen(4000, function() {
    console.log("SERVER!!");
})