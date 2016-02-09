import express from 'express';
import AlbumsRepositoryClass from '../../repository/AlbumsRepository';
import MusicRepositoryClass from '../../repository/MusicRepository';
import Busboy from 'busboy';
import path from 'path';
import fs from 'fs';


let albums = express.Router();
let AlbumsRepository = new AlbumsRepositoryClass();
let MusicRepository = new MusicRepositoryClass();

albums.get('/', (req, res) => {
  AlbumsRepository.getAll(function (result) {
  res.json({albums:result, status: {success: 'Ok', error: null}});
  });
});

albums.get('/music/:id', (req,res) => {
  let albumsId = req.params.id;
  AlbumsRepository.getOne({_id: albumsId}, function (results_one) {
    MusicRepository.getAllmusic({idAlbums:results_one._id}, function (result_two) {
    res.json({albums: results_one, albums: result_two, status:{success:'Ok', error:null}});
    });
  });
});

albums.get('/imgGet/:name', function (req, res) {

  var options = {
   root: 'f:/myProject/!server/myapp/uploads/images/albums/',
   dotfiles: 'deny',
   headers: {
       'x-timestamp': Date.now(),
       'x-sent': true
   }
 };

 var fileName = req.params.name;
 res.sendFile(fileName, options, function (err) {
   if (err) {
     console.log(err);
     res.status(err.status).end();
   }
   else {
     console.log('Sent:', fileName);
   }
 });
});


// albums.get('/:id/:title', (req,res) => {
//   let albumsId = req.params.id;
//   let title = req.params.title;
//   AlbumsRepository.getOne({title: title, _id: albumsId}, function (results_one) {
//     MusicRepository.getAllmusic({idAlbums:results_one._id}, function (result_two) {
//     res.json({albums: results_one, albums: result_two, status:{success:'Ok', error:null}});
//     });
//   });
// });

albums.post('/', (req, res) => {
    let albums = req.body.albums;
    if (!albums.title) {
        res.json({albums: null, status: {success: null, error: 'No title albums'}});
    }
    AlbumsRepository.getOne({title: albums.title}, function (result) {
        if (!result) {
          AlbumsRepository.create(albums, function (result) {
                res.json(result);
            });
        } else {
            res.json({albums: null, status: {success: null, error: 'title is using by other member'}});
        }
    });
});



albums.get('/:id', (req,res) => {
  let albums = req.params.id;
  AlbumsRepository.getOne({_id: albums}, function (result) {
    res.json({albums: result, status:{success:'Ok', error:null}});
  });
});




albums.delete('/:id', (req,res) => {
  let albumsId = req.params.id;
  AlbumsRepository.delete(albumsId, function (result) {
    res.json( result);
  });
});

albums.put('/:id', (req, res) => {
    let albums = req.body.albums;
    albums._id =req.params.id;
    AlbumsRepository.update(albums, function (result) {
        res.json(result);
    });
});

albums.post('/new', function(req, res) {
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
       let saveTo = path.join('f:/myProject/!server/myapp/uploads/images/albums/', path.basename(filename));
       let link = '/albums/' + filename;
       let obj = {img: filename};
       req.body.fullName = filename;
       file.pipe(fs.createWriteStream(saveTo));
     });
     busboy.on('finish', function() {
        let resArchive;
        var obj = req.body;
        var id = req.body._id;
        obj.img = req.body.fullName;
          AlbumsRepository.create(obj, function (result) {
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

albums.post('/edit', function(req, res) {
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
       let saveTo = path.join('f:/myProject/!server/myapp/uploads/images/albums/', path.basename(filename));
       let link = '/albums/' + filename;
       let obj = {img: filename};
       req.body.fullName = filename
       file.pipe(fs.createWriteStream(saveTo));
     });
     busboy.on('finish', function() {
        let resArchive;
        var obj = req.body;
        var id = req.body._id;
        obj.img = req.body.fullName;
        AlbumsRepository.getOne({_id:id}, function(result) {
          if(result) {
          AlbumsRepository.update(obj, function (result) {
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








export default albums;
