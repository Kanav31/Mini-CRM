const ensureAuthenticated = (req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('User:', req.user);
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

const ensureAdmin = (req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('User:', req.user);
    if (req.isAuthenticated() && req.user.email === process.env.ADMIN_EMAIL) {
        return next();
    }
    res.status(403).json({ message: 'Access denied' });
};

module.exports = { ensureAuthenticated, ensureAdmin };
