import co from 'co';
import Genre from '../models/Genre';

export default class GenreRepository {

  getOne(obj, cb) {
      Genre.findOne(obj,
          function (err, results) {
              cb(results);
          }
      );
  }

  getAll(cb){
    //let returnObj;
    Genre.find(function (err, results) {
      cb(results);
    });
  };

  create(obj, cb) {
      let returnObj;
      let createGenre = co(function*() {
          let NewGenre = new Genre(obj);
          return yield Promise.resolve(NewGenre.save());
      });


      let findGenre = function (data) {
          Genre.findOne({_id: data.genreId},
              function (err, results) {
                  if (!err) {
                      returnObj = {genre: results, status: {success: 'Genre was created', error: null}};
                      cb(returnObj)
                  }
                  else {
                      returnObj = {genre: null, status: {success: null, error: err.message}};
                      cb(returnObj);
                  }
              });
      };


      createGenre
          .
          then(findGenre,
          function (err) {
              console.error(err.stack);
          });
  }

  update(obj, cb){
    let returnObj;
    Genre.findByIdAndUpdate(obj._id, {$set: obj}, function (err) {
      if (err) {
          returnObj = {genre: null, status: {success: null, error: err.message}};
          cb(returnObj);
      }
      else{
        Genre.findOne({_id: obj._id}, {}, function (err, genre) {
          if(err){
            returnObj= {genre: null, status: {success: null, error: err.message}};
            cb(returnObj);
          }
          else {
            returnObj = {genre: genre, status: {success: 'Genre was updates', error: null}};
            cb(returnObj);
            }
          });
        }
      });
  }


  delete(id, cb){
    let returnObj;
    Genre.remove({_id: id}, function (err) {
      if(err){
        returnObj = {genre: result, status: {success: null, error: err.message }};
      }
      else{
        returnObj = {genre: null, status: {success: 'Ok', error:null }};
      }
      cb(returnObj);
    });
  };






}
