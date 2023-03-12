const jwt = require('jsonwebtoken');
const { TOKEN_SECRET_KEY } = require('../config');
const tokenGenerate = (payload) => {
    const token = jwt.sign(payload, TOKEN_SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: '15m'
    })
    return token;
}


module.exports = {
    tokenGenerate: tokenGenerate
}