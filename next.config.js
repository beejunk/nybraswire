const dotenv = require('dotenv');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');

dotenv.config();

module.exports = withSass(withCSS({
  env: {
    firebase: {
      apiKey: process.env.FB_API_KEY,
      authDomain: process.env.FB_AUTH_DOMAIN,
      databaseURL: process.env.FB_DB_URL,
      projectId: process.env.FB_PROJECT_ID,
      storageBucket: process.env.FB_STORAGE_BUCKET,
      messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
    },
  },
}));
