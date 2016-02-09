import express from 'express';
import PerformerRepositoryClass from '../../repository/PerformerRepository';
import MusicRepositoryClass from '../../repository/MusicRepository';
import Busboy from 'busboy';
import path from 'path';
import fs from 'fs';

let MusicRepository = new MusicRepositoryClass();

let performer = express.Router();
let PerformerRepository = new PerformerRepositoryClass();

performer.get('/imgGet/:name', function (req, res) {

  var options = {
   root: 'f:/myProject/!server/myapp/uploads/images/performer/',
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


performer.post('/', (req, res) => {
    let performer = req.body.performer;
    if (!performer.title) {
        res.json({performer: null, status: {success: null, error: 'No title performer'}});
    }
    PerformerRepository.getOne({title: performer.title}, function (result) {
        if (!result) {
          PerformerRepository.create(performer, function (result) {
                res.json(result);
            });
        } else {
            res.json({performer: null, status: {success: null, error: 'title is using '}});
        }
    });
});

performer.get('/', (req, res) => {
  PerformerRepository.getAll(function (result) {
    res.json({performer: result, status: {success: 'Ok', error: null}});
  });
});

performer.get('/:id', (req, res) => {
  let performerId = req.params.id;
  PerformerRepository.getOne({_id: performerId}, function (result) {
    res.json({performer: result, status: {success: 'Ok', error: null}});
  });
});

performer.get('/:id/:title', (req, res)  => {
  let performerId = req.params.id;
  let title = req.params.title;
  PerformerRepository.getOne({title: title, _id: performerId}, function (results_one) {
    MusicRepository.getOne({_id: performerId}, function (result_two) {
      res.json({performers: results_one, performer:result_two, status:{success: 'Ok', error:null}});
    });
});
});

performer.delete('/:id', (req, res) => {
  let idPerformer = req.params.id;
  PerformerRepository.delete(idPerformer, function (result) {
    res.json(result);
  });
});


performer.put('/:id', (req, res) => {
  let performer = req.body.performer;
  performer._id = req.params.id;
  PerformerRepository.update(performer, function (result) {
    res.json(result);
  });
});


performer.post('/edit', function(req, res) {
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
       let saveTo = path.join('f:/myProject/!server/myapp/uploads/images/performer/', path.basename(filename));
       let link = '/performer/' + filename;
       let obj = {img: filename};
       req.body.fullName = filename
       file.pipe(fs.createWriteStream(saveTo));
     });
     busboy.on('finish', function() {
        let resArchive;
        var obj = req.body;
        var id = req.body._id;
        obj.img = req.body.fullName;
        PerformerRepository.getOne({_id:id}, function(result) {
          if(result) {
          PerformerRepository.update(obj, function (result) {
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

performer.post('/new', function(req, res) {
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
       let saveTo = path.join('f:/myProject/!server/myapp/uploads/images/performer/', path.basename(filename));
       let link = '/performer/' + filename;
       let obj = {img: filename};
       req.body.fullName = filename
       file.pipe(fs.createWriteStream(saveTo));
     });
     busboy.on('finish', function() {
        let resArchive;
        var obj = req.body;
        var id = req.body._id;
        obj.img = req.body.fullName;
          PerformerRepository.create(obj, function (result) {
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




export default performer;
