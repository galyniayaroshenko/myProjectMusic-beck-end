import co from 'co';
import Performer from '../models/Performer';

export default class PerformerRepository {

  getOne(obj, cb) {
      Performer.findOne(obj,
          function (err, results) {
              cb(results);
          }
      );
  }

  getAll(cb){
    let returnObj;
    Performer.find(
      function (err, results) {
      cb(results);
    });
  }

  create(obj, cb) {
      let returnObj;
      let createPerformer = co(function*() {
          let NewPerformer = new Performer(obj);
          return yield Promise.resolve(NewPerformer.save());
      });


      let findPerformer = function (data) {
          Performer.findOne({_id: data.performerId},
              function (err, results) {
                  if (!err) {
                      returnObj = {performer: results, status: {success: 'Performer was created', error: null}};
                      cb(returnObj)
                  }
                  else {
                      returnObj = {performer: null, status: {success: null, error: err.message}};
                      cb(returnObj);
                  }
              });
      };


      createPerformer
          .
          then(findPerformer,
          function (err) {
              console.error(err.stack);
          });
  }


  update(obj, cb){
    let returnObj;
    Performer.findByIdAndUpdate(obj._id, {$set: obj}, function (err) {
      if (err){
        returnObj = {performer:null, status: {success: null, error: err.message}};
      }
      else {
        Performer.findOne({_id: obj._id}, {}, function (err, performer) {
          if(err){
            returnObj = {performer: null, status: {success: null, error: err.message}};
            cb(returnObj);
          }
          else {
            returnObj = {performer: performer, status: {success: 'Performer was updates', error: null}};
            cb(returnObj);
          }
        });
      }
    });
  };


  delete(id, cb) {
      let returnObj;
      Performer.remove({_id: id}, function (err) {
          if (err)
              returnObj = {performer: null, status: {success: null, error: err.message}};
          else {
              returnObj = {performer: null, status: {success: 'Performer was deleted.', error: null}};
          }
          cb(returnObj);
      });
  }








}
