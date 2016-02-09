import express from 'express';
import GenreRepositoryClass from '../../repository/GenreRepository';
import MusicRepositoryClass from '../../repository/MusicRepository';
import Busboy from 'busboy';
import path from 'path';
import fs from 'fs';

let genre = express.Router();
let GenreRepository = new GenreRepositoryClass();
let MusicRepository = new MusicRepositoryClass();

genre.get('/music/:id', (req,res) => {
  let genreId = req.params.id;
  GenreRepository.getOne({_id: genreId}, function (results_one) {
    MusicRepository.getAllmusic({idGenre:results_one._id}, function (result_two) {
    res.json({genre: results_one, genre: result_two, status:{success:'Ok', error:null}});
    });
  });
});

genre.get('/imgGet/:name', function (req, res) {

  var options = {
   root: 'f:/myProject/!server/myapp/uploads/images/genre/',
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


genre.post('/', (req, res) => {
    let genre = req.body.genre;
    if (!genre.title) {
        res.json({genre: null, status: {success: null, error: 'No title genre'}});
    }
    GenreRepository.getOne({title: genre.title}, function (result) {
        if (!result) {
          GenreRepository.create(genre, function (result) {
                res.json(result);
            });
        } else {
            res.json({genre: null, status: {success: null, error: 'title is using by other member'}});
        }
    });
});

genre.get('/', (req, res) => {
  GenreRepository.getAll(function (result) {
    res.json({genre: result, status: {success: 'Ok', error: null}});
  });
});


genre.get('/:id', (req, res) => {
  let genreId = req.params.id;
  GenreRepository.getOne({_id: genreId}, function (result) {
    res.json({genre: result, status: {success: 'Ok', error:null }});
  });
});

genre.get('/:id/:title', (req, res) => {
  let genreId = req.params.id
  let title = req.params.title;
  GenreRepository.getOne({title: title, _id: genreId}, function (results_one) {
  MusicRepository.getOne({_id: genreId}, function (result_two) {
    res.json({genre:results_one, genre: result_two, status: {success: 'Ok', error: null}});
  });
  });
});


genre.delete('/:id', (req,res) => {
  let genreId= req.params.id;
  GenreRepository.delete(genreId, function (result) {
    res.json(result);
  });
});

genre.put('/:id', (req, res) => {
  let genre = req.body.genre;
  genre._id = req.params.id;
  GenreRepository.update(genre, function (result) {
    res.json(result);
  });
});

genre.post('/edit', function(req, res) {
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
       let saveTo = path.join('f:/myProject/!server/myapp/uploads/images/genre/', path.basename(filename));
       let link = '/genre/' + filename;
       let obj = {img: filename};
       req.body.fullName = filename
       file.pipe(fs.createWriteStream(saveTo));
     });
     busboy.on('finish', function() {
        let resArchive;
        var obj = req.body;
        var id = req.body._id;
        obj.img = req.body.fullName;
        GenreRepository.getOne({_id:id}, function(result) {
          if(result) {
          GenreRepository.update(obj, function (result) {
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

genre.post('/new', function(req, res) {
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
       let saveTo = path.join('f:/myProject/!server/myapp/uploads/images/genre/', path.basename(filename));
       let link = '/genre/' + filename;
       let obj = {img: filename};
       req.body.fullName = filename
       file.pipe(fs.createWriteStream(saveTo));
     });
     busboy.on('finish', function() {
        let resArchive;
        var obj = req.body;
        var id = req.body._id;
        obj.img = req.body.fullName;
          GenreRepository.create(obj, function (result) {
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


export default genre;
