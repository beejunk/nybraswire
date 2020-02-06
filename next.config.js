const dotenv = require('dotenv');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');

dotenv.config();

module.exports = withSass(withCSS({
  env: {
    FB_API_KEY: process.env.FB_API_KEY,
    FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN,
    FB_DB_URL: process.env.FB_DB_URL,
    FB_PROJECT_ID: process.env.FB_PROJECT_ID,
    FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET,
    FB_MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID,
  },
}));
