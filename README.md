# Facebook Login Node.js App

This is a simple Node.js web application that allows users to log in using Facebook and retrieve their profile data.

## Setup

1. Create a Facebook App at https://developers.facebook.com/
2. Get your App ID and App Secret.
3. Replace `YOUR_FACEBOOK_APP_ID` and `YOUR_FACEBOOK_APP_SECRET` in `server.js` with your actual values.
4. Set the callback URL in your Facebook App settings to `http://localhost:3000/auth/facebook/callback`

## Installation

Run `npm install` to install dependencies.

## Running

Run `npm start` to start the server on port 3000.

Open http://localhost:3000 in your browser.

Click "Login with Facebook" to authenticate and view your profile data at /profile.

## Troubleshooting

- Ensure Node.js is installed.
- Check that your Facebook App is configured correctly.
- For production, use HTTPS and secure session secrets.