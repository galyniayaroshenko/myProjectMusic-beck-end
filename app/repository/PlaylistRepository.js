import co from 'co';
import Playlist from '../models/Playlist';

export default class PlaylistRepository {

  getAll(cb) {
      let returnObj;
      Playlist.find(
          function (err, results) {
              cb(results);
          }
      );
  }

  getOne(obj, cb) {
      Playlist.findOne(obj,
          function (err, results) {
              cb(results);
          }
      );
  }

  create(obj, cb) {
      let returnObj;
      let createPlaylist = co(function*() {
          let NewPlaylist = new Playlist(obj);
          return yield Promise.resolve(NewPlaylist.save());
      });


      let findPlaylist = function (data) {
          Playlist.findOne({_id: data.playlistId},
              function (err, results) {
                  if (!err) {
                      returnObj = {playlist: results, status: {success: 'Playlist was created', error: null}};
                      cb(returnObj)
                  }
                  else {
                      returnObj = {playlist: null, status: {success: null, error: err.message}};
                      cb(returnObj);
                  }
              });
      };


      createPlaylist
          .
          then(findPlaylist,
          function (err) {
              console.error(err.stack);
          });
  }

  update(obj, cb){
    let returnObj;
    Playlist.findByIdAndUpdate(obj._id, {$set: obj}, function (err) {
      if (err){
        returnObj = {playlist: null, status: {success: null, error: err.massage}};
        cb(returnObj);
      }
      else {
          Playlist.findOne({_id: obj._id}, {}, function (err, playlist) {
            if (err) {
                returnObj = {playlist: null, status: {success: null, error: err.message}};
                cb(returnObj);
            }
            else {
                returnObj = {playlist: playlist, status: {success: 'playlist was updates', error: null}};
                cb(returnObj);
            }
      });
  }
})
}


 delete(id, cb) {
   let returnObj;
   Playlist.remove({_id: id}, function (err) {
     if(err){
       returnObj = {music: null, status: {success: null, error: err.message}};
     } else {
       returnObj = {music: null, status: {success: 'Music was deleted.', error: null}};
     }
     cb(returnObj);
   });
 }



 }
