import express from 'express';
import Busboy from 'busboy';
import path from 'path';
import fs from 'fs';
import MusicRepositoryClass from '../../repository/MusicRepository';
//import Music from '../../models/Music';

let music = express.Router();
let MusicRepository = new MusicRepositoryClass();

music.get('/musicGet/:name', function (req, res) {

  var options = {
   root: 'f:/myProject/!server/myapp/uploads/music/',
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

music.get('/imgGet/:name', function (req, res) {

  var options = {
   root: 'f:/myProject/!server/myapp/uploads/images/music/',
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

music.get('/', (req, res) => {

    MusicRepository.getAll(function (result) {
        res.json({music: result, status: {success: 'Ok', error: null}});
    });
});

music.get('/likeUpdete/:id', (req, res) => {
    let musicId = req.params.id;
    MusicRepository.getOne({_id: musicId}, function (result) {
      if (!result){
        res.json({ status: {success: '', error: 'error'}});
      } else {
        let like = result.idLike;
        like = result.idLike +1;
        console.log(like);
        MusicRepository.update({_id: musicId, idLike:like}, function (result) {
          if(!result){
            res.json({ status: {success: '', error: 'error'}});
          } else {
            res.json(result);
          }
        });
      };
    });
});

music.get('/chooseLike', (req, res) => {
  MusicRepository.getSomeHitSort( function (result) {
    if (!result){
      res.json({ status: {success: null, error: 'error'}});
    }
    else {
      res.json(result);
    }
  });
});

music.get('/getSongs', (req, res) => {
  MusicRepository.getSomeSong( function (result) {
    res.json({music: result, status: {success: 'Ok', error: null}});
  });
});

music.get('/getSongsNow', (req, res) => {
  MusicRepository.getSongNow( function (result) {
    res.json({music: result, status: {success: 'Ok', error: null}});
  });
});


// music.get('/getSongsDate/:date', (req, res) => {
//   let music = req.params.date;
//   let musicDate = musicDate.replace('.', '/');
//   MusicRepository.getSongDate(musicDate, function (result) {
//     res.json({music: result, status: {success: 'Ok', error: null}});
//   });
// });

music.get('/newSongs', (req, res) => {
  let cutoff = new Date();
  cutoff.setDate(cutoff.getDate()-5);
  Music.find({modificationDate: {$lt: cutoff}},
    function (result) {
    res.json({music: result, status: {success: 'Ok', error:null}});
  });
});

music.get('/newSongs', (req, res) => {
  MusicRepository.getNewSong(function (result) {
    res.json({music: result, status: {success: 'Ok', error:null}});
  });
});

music.get('/:id', (req, res) => {
    let musicId = req.params.id;
    MusicRepository.getOne({_id: musicId}, function (result) {
        res.json({music: result, status: {success: 'Ok', error: null}});
    });
});

music.get('/:id/:title', (req, res) => {
  let musicId = req.params.id;
  let title = req.params.title;
  MusicRepository.getOne({title: title, _id: musicId}, function (result) {
    res.json({music: result, status: {success: 'Ok', error: null }});
  });
});

music.post('/', (req, res) => {
    let music = req.body.music;
    if (!music.title) {
        res.json({user: null, status: {success: null, error: 'No title'}});
    }
    MusicRepository.getOne({title: music.title}, function (result) {
        if (!result) {
          MusicRepository.create(music, function (result) {
                res.json(result);
            });
        } else {
            res.json({music: null, status: {success: null, error: 'title is using by other member'}});
        }
    });
});

music.put('/', (req, res) => {
    let music = req.body.music;
    //music._id =req.params.id;
    MusicRepository.update(music, function (result) {
        res.json(result);
    });
});


music.delete('/:id', (req, res) => {
    let musicId = req.params.id;
    MusicRepository.delete(musicId, function (result) {
        res.json(result);
    });
});


music.post('/edit', function(req, res) {
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

      let saveTo;

    if (fieldname == 'file') {
       req.body.img = filename;
       saveTo = path.join('f:/myProject/!server/myapp/uploads/images/music/', path.basename(filename));
     } else {
       req.body.song = filename;
       saveTo = path.join('f:/myProject/!server/myapp/uploads/music/', path.basename(filename));
     }

      file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function() {
       let resArchive;
       var obj = req.body;
       var fullName = req.body.fullName;
       let date1 = req.body.date;
       let date = new Date(date1).getTime()/1000;
       date = parseFloat(date).toFixed(0);
       obj.date =  date;
       var id = req.body._id;
       obj.img = req.body.fullName;

       MusicRepository.getOne({_id:id}, function(result) {
         if(result) {
           MusicRepository.update(obj, function (result) {
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





music.post('/new', function(req, res) {
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

      let saveTo;

if (fieldname == 'file') {
       req.body.img = filename;
       saveTo = path.join('f:/myProject/!server/myapp/uploads/images/music/', path.basename(filename));
     } else {
       req.body.song = filename;
       saveTo = path.join('f:/myProject/!server/myapp/uploads/music/', path.basename(filename));
     }



      file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function() {
       let resArchive;
       var obj = req.body;

       obj.url = 'http://localhost:3000/api/v1/music/musicGet/'+ req.body.song;
       let date1 = req.body.date;
       let date = new Date().getTime();
      //  date = parseFloat(date).toFixed(0);
       obj.date =  date;
       //obj.img = req.body.fullName;
       var id = req.body._id;


           MusicRepository.create(obj, function (result) {
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


export default music;
