import mongoose from 'mongoose';

var cryptPassword = require('../utils').cryptPassword;


let Schema = mongoose.Schema;

let User = new Schema({
    name: {type: String, trim: true, default: null},
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true,
        default: null
    },
    password: {type: String, default: null, set: cryptPassword},
    accessToken: {type: String, default: null, trim: true},
	  img: {type: String, default: null},
    isAdmin: {type: Boolean, default: null}
}, {
    collection: 'users',
    _id: true,
    versionKey: false
});

User.path('email').validate(function (value) {
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(value);
}, 'Please fill a valid email address');

User.methods.authenticate = function (password) {
    return this.password === cryptPassword(password);
};

User.set('toJSON', {virtuals: true});
export default mongoose.model('User', User);
