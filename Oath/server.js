import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Routes
app.get("/", (req, res) => {
    res.send(`<h1>Home</h1><a href="/auth/google">Login with Google</a>`);
});

// Start Google Auth
app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route
app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        // Successful authentication
        res.redirect("/profile");
    }
);

// Profile route
app.get("/profile", (req, res) => {
    if (!req.user) return res.redirect("/");
    res.send(`<h1>Welcome ${req.user.displayName}</h1>`);
});

app.listen(3000, () => {
    console.log("Server is listening on http://localhost:3000");
});
