const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:5173/login',
        successRedirect: 'http://localhost:5173/dashboard'
    }),
);

router.get('/login/sucess', async (req, res) => {
    if (req.user) {
        console.log(req.user);
        res.status(200).json({ message: "user Logged in", user: req.user });
    } else {
        res.status(400).json({ message: "Not Authorize" });
    }
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('http://localhost:5173/');
    });
});

module.exports = router;
