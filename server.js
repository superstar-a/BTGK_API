const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');

const app = express();

// Replace with your Facebook App ID and Secret
const FACEBOOK_APP_ID = '1450935356512078';
const FACEBOOK_APP_SECRET = 'e1005b984c30916be92b19b0488bf6e6';

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
  // Here you can save the user profile to database if needed
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(session({
  secret: 'your_session_secret', // Change this to a random string
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect to profile
    res.redirect('/profile');
  });

app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    const name = user.displayName;
    const email = user.emails ? user.emails[0].value : 'N/A';
    const avatar = user.photos ? user.photos[0].value : '';

    // Mock permissions based on user (for demo)
    const permissions = {
      roles: ['user'],
      access: ['read', 'write']
    };

    // API result JSON
    const apiResult = {
      userInfo: {
        name: name,
        email: email,
        avatar: avatar
      },
      permissions: permissions
    };

    // Send HTML page displaying the info
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Profile</title>
      </head>
      <body>
        <h1>Welcome, ${name}!</h1>
        <p><strong>Email:</strong> ${email}</p>
        ${avatar ? `<img src="${avatar}" alt="Avatar" style="width:100px;height:100px;">` : ''}
        <h2>API Result (JSON):</h2>
        <pre>${JSON.stringify(apiResult, null, 2)}</pre>
        <a href="/logout">Logout</a>
      </body>
      </html>
    `);
  } else {
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});