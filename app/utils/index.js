var crypto = require('crypto');

function getDigestHash(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

exports.cryptPassword = function (password) {
    return getDigestHash(password);
};

exports.generateToken = function (email, password) {
    var tokenKey = email + password /*+ new Date().getTime()*/;
    return getDigestHash(tokenKey);
}
