import co from 'co';
import Albums from '../models/Albums';

export default class AlbumsRepository {

  getOne(obj, cb) {
      Albums.findOne(obj,
          function (err, results) {
              cb(results);
          }
      );
  }

  create(obj, cb) {
      let returnObj;
      let createAlbums = co(function*() {
          let NewAlbums = new Albums(obj);
          return yield Promise.resolve(NewAlbums.save());
      });


      let findAlbums = function (data) {
          Albums.findOne({_id: data.albumsId},
              function (err, results) {
                  if (!err) {
                      returnObj = {albums: results, status: {success: 'Albums was created', error: null}};
                      cb(returnObj)
                  }
                  else {
                      returnObj = {albums: null, status: {success: null, error: err.message}};
                      cb(returnObj);
                  }
              });
      };


      createAlbums
          .
          then(findAlbums,
          function (err) {
              console.error(err.stack);
          });
  }

getAll(cb){
  let returnObj;
  Albums.find(
    function (err, result) {
      cb(result);
  });
}

getOne(obj, cb){
  Albums.findOne(obj,
    function (err, result) {
    cb(result);
  });
}

delete(id, cb){
  let returnObj;
  Albums.remove({_id: id}, function (err) {
    if (err)
        returnObj = {music: null, status: {success: null, error: err.message}};
    else {
        returnObj = {music: null, status: {success: 'Music was deleted.', error: null}};
    }
    cb(returnObj);
  });
};

update(obj, cb) {
    let returnObj;
    Albums.findByIdAndUpdate(obj._id, {$set: obj}, function (err) {
        if (err) {
            returnObj = {albums: null, status: {success: null, error: err.message}};
            cb(returnObj);
        }
        else {
            Albums.findOne({_id: obj._id}, {}, function (err, albums) {
                if (err) {
                    returnObj = {albums: null, status: {success: null, error: err.message}};
                    cb(returnObj);
                } else {
                    returnObj = {albums: albums, status: {success: 'Albums was updates', error: null}};
                    cb(returnObj);
                }
            });
        }
    });
}



}
