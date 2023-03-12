require('dotenv').config();

module.exports = {
    //  PORT: process.env.PORT,
    //   CONNECTION_STRING: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9lbf98t.mongodb.net/${process.env.DB_NAME}`,
    // EMAIL_SERVICE_API_KEY: process.env.EMAIL_SERVICE_API_KEY,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD,
    TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY
}