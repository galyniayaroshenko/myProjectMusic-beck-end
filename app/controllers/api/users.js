import express from 'express';
import UserRepositoryClass from '../../repository/UserRepository';
import ensureAuth from './token_auth';
import Busboy from 'busboy';
import path from 'path';
import fs from 'fs';

let users = express.Router();
let UserRepository = new UserRepositoryClass();

users.get('/logout', (req, res) => {
    let token = req.headers.token;
    if(token == undefined)
    {
      token = 'none';
    }
    UserRepository.getOne({accessToken: token}, function(result) {
      if(result) {
        result.accessToken = null;
        UserRepository.update(result, function(data) {
          res.json(data);
        });
      } else {
          res.json({user: null, status: {success: null, error: 'token is null'}});
      }
    });
});


users.get('/', (req, res) => {
    UserRepository.getAll(function (result) {
        res.json({users: result, status: {success: 'Ok', error: null}});
    });
});

users.get('/:id',  (req, res) => {
    let userId = req.params.id;
    UserRepository.getOne({_id: userId}, function (result) {
        res.json({user: result, status: {success: 'Ok', error: null}});
    });
});

// users.get('/logout', (req, res) => {
//     let accessToken = req.headers.token;
//     if(accessToken == undefined)
//     {
//       accessToken = 'none';
//     }
//     UserRepository.getOne({accessToken: accessToken}, function (result) {
//         result.accessToken = null;
//         UserRepository.update(result, function (data) {
//           res.json({user: data, status: {success: 'ok', error: 'null'}});
//         });
//         res.json({user: result, status: {success: 'Ok', error: null}});
//     });
// });


users.post('/', (req, res) => {
    let user = req.body.user;
    console.log(user);
    if (!user.email) {
        res.json({user: null, status: {success: null, error: 'No Email'}});
    }
    UserRepository.getOne({email: user.email}, function (result) {
        if (!result) {
            UserRepository.create(user, function (result) {
                res.json(result);
            });
        } else {
            res.json({user: null, status: {success: null, error: 'Email is using by other member'}});
        }
    });
});

users.put('/:id', (req, res) => {
    let user = req.body.user;
    user._id = req.params.id;
    user.lastUpdate = new Date().getTime();
    UserRepository.update(user, function (result) {
        res.json(result);
    });
});

users.delete('/:id', (req, res) => {
    let userId = req.params.id;
    UserRepository.delete(userId, function (result) {
        res.json(result);
    });
});


users.post('/edit', function(req, res) {
  if (req.method === 'POST') {
     let busboy = new Busboy({ headers: req.headers });
       busboy.on('field', function(fieldname, val, valTruncated, keyTruncated) {
        if (req.body.hasOwnProperty(fieldname)) {
          if (Array.isArray(req.body[fieldname])) {
            req.body[fieldname].push(val);
          } else {
            req.body[fieldname] = [req.body[fieldname], val];
          }
        } else {
          req.body[fieldname] = val;

        }
      });
     busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
       let saveTo = path.join('f:/myProgect/myProgectMusic/build/images/users/', path.basename(filename));
       let link = '/users/' + filename;
       let obj = {img: filename};
       req.body.fullName = filename;
       file.pipe(fs.createWriteStream(saveTo));
     });
     busboy.on('finish', function() {
        let resArchive;
        var obj = req.body;
        var id = req.body._id;
        obj.img = req.body.fullName;
        UserRepository.getOne({_id:id}, function(result) {
          if(result) {
          UserRepository.update(obj, function (result) {
                resArchive = result;
            });
          }
        });
       res.writeHead(200, { 'Connection': 'close' });
       res.end(resArchive);
     });
     return req.pipe(busboy);
   }
   res.writeHead(404);
   res.end();
});


users.post('/new', function(req, res) {
  if (req.method === 'POST') {
     let busboy = new Busboy({ headers: req.headers });
       busboy.on('field', function(fieldname, val, valTruncated, keyTruncated) {
        if (req.body.hasOwnProperty(fieldname)) {
          if (Array.isArray(req.body[fieldname])) {
            req.body[fieldname].push(val);
          } else {
            req.body[fieldname] = [req.body[fieldname], val];
          }
        } else {
          req.body[fieldname] = val;

        }
      });
     busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
       let saveTo = path.join('f:/myProgect/myProgectMusic/build/images/users/', path.basename(filename));
       let link = '/users/' + filename;
       let obj = {img: filename};
       req.body.fullName = filename;
       file.pipe(fs.createWriteStream(saveTo));
     });
     busboy.on('finish', function() {
        let resArchive;
        var obj = req.body;
        var id = req.body._id;
        obj.img = req.body.fullName;
          UserRepository.create(obj, function (result) {
                resArchive = result;
            });

       res.writeHead(200, { 'Connection': 'close' });
       res.end(resArchive);
     });
     return req.pipe(busboy);
   }
   res.writeHead(404);
   res.end();
});



export default users;
