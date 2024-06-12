require('dotenv').config()
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();
const User = require('./models/user');

const { initConsumer } = require('./KafkaConsumer.js');
// Db connection
const connectDB = require('./db/connect.js');

// routes
const customerRoutes = require('./routes/customer.js');
const orderRoutes = require('./routes/order.js');
const userAuth = require('./routes/userAuth.js');
const campaignRoutes = require('./routes/campaign');



const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: "GET,POST,PUT,DELETE",
        credentials: true
    })
);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// passport setup

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ['profile', 'email'],
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
                user = new User({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                });
                await user.save();
            }
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
    console.log(user);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, false);
    }
});

const adminRoutes = require('./routes/admin');
// routes
app.use('/api/v1/customer', customerRoutes);
app.use('/api/v1/order', orderRoutes);
app.use('/', userAuth);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/campaign', campaignRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log('DB connected successfully')
        await initConsumer();
    } catch (error) {
        console.log(error)
    }
}

start()