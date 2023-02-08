require('dotenv').config();
const env = process.env;

module.exports = {
    PORT : env.PORT,
    DB_URL: env.DB_URL,
    DEBUG_MODE: env.DEBUG_MODE,
    JWT_SECRET: env.JWT_SECRET
}