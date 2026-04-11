const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
require('dotenv').config();  // Load biến từ file .env

const app = express();

// Lấy thông tin từ file .env
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'photos', 'email']
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

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

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
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            max-width: 600px;
            width: 100%;
          }
          h1 {
            color: #333;
            text-align: center;
            margin-bottom: 20px;
          }
          p {
            font-size: 18px;
            margin: 10px 0;
          }
          img {
            display: block;
            margin: 20px auto;
            border-radius: 50%;
            width: 100px;
            height: 100px;
          }
          h2 {
            color: #555;
            margin-top: 30px;
          }
          pre {
            background-color: #f8f8f8;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            font-size: 14px;
            border: 1px solid #ddd;
          }
          a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #4267B2;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
          }
          a:hover {
            background-color: #365899;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome, ${name}!</h1>
          <p><strong>Email:</strong> ${email}</p>
          ${avatar ? `<img src="${avatar}" alt="Avatar">` : ''}
          <h2>API Result (JSON):</h2>
          <pre>${JSON.stringify(apiResult, null, 2)}</pre>
          <a href="/logout">Logout</a>
        </div>
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