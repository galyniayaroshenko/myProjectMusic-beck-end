import co from 'co';
import User from '../models/User';

var generateToken = require('../utils').generateToken;

export default class UserRepository {
    getAll(cb) {
        let returnObj;
        User.find(
            function (err, results) {
                cb(results);
            }
        );
    }

    getOne(obj, cb) {
        User.findOne(obj,
            function (err, results) {
                cb(results);
            }
        );
    }

    create(obj, cb) {
        let returnObj;
        let createUser = co(function*() {
            let NewUser = new User(obj);
            return yield Promise.resolve(NewUser.save());
        });


        let findUser = function (data) {
            User.findOne({_id: data.userId},
                function (err, results) {
                    if (!err) {
                        returnObj = {user: results, status: {success: 'User was created', error: null}};
                        cb(returnObj)
                    }
                    else {
                        returnObj = {user: null, status: {success: null, error: err.message}};
                        cb(returnObj);
                    }
                });
        };


        createUser
            .
            then(findUser,
            function (err) {
                console.error(err.stack);
            });
    }

    update(obj, cb) {
        let returnObj;
        User.findByIdAndUpdate(obj._id, {$set: obj}, function (err) {
            if (err) {
                returnObj = {user: null, status: {success: null, error: err.message}};
                cb(returnObj);
            }
            else {
                User.findOne({_id: obj._id}, {}, function (err, user) {
                    if (err) {
                        returnObj = {user: null, status: {success: null, error: err.message}};
                        cb(returnObj);
                    } else {
                        returnObj = {user: user, status: {success: 'User was updates', error: null}};
                        cb(returnObj);
                    }
                });
            }
        });
    }

    delete(id, cb) {
        let returnObj;
        User.remove({_id: id}, function (err) {
            if (err)
                returnObj = {user: null, status: {success: null, error: err.message}};
            else {
                returnObj = {user: null, status: {success: 'User was deleted.', error: null}};
            }
            cb(returnObj);
        });
    }

    loginByEmail(obj, cb) {
        let email = obj.email;
        let password = obj.password;
        let returnObj;
        co(function *() {
            try {
                var user = yield User.findOne({email: email}).exec();
                if (user && user.authenticate(password)) {
                    let token = generateToken(user.email, user.password);
                    user.accessToken = token;
                    let savedUser = yield user.save();
                    cb({user: savedUser, status: {success: 'Ok', error: null}});
                } else {
                    throw new Error('User not found!!');
                }
            } catch (e) {
                cb({user: null, status: {success: null, error: e.message}});
            }
        });
    }

}    
