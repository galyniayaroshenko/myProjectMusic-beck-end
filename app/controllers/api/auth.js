import express from 'express';
import request from 'request';
import sha1 from 'sha1';
import UserRepositoryClass from '../../repository/UserRepository';
import {SERVERNAME} from '../../config';

var generateToken = require('../../utils').generateToken;

let auth = express.Router();
let UserRepository = new UserRepositoryClass();


auth.post('/loginByEmail', (req, res) => {
    let login = req.body;
    let email = login.email;
    let password = login.password;
    UserRepository.loginByEmail({email: email, password: password}, function (data) {
        res.json(data);
    });
});
export default auth;
