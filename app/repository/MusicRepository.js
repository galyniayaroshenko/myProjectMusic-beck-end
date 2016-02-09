import co from 'co';
import Music from '../models/Music';

export default class MusicRepository {
    getAll(cb) {
        let returnObj;
        Music.find(
            function (err, results) {
                cb(results);
            }
        );
    }

    getAllmusic(obj, cb) {
        let returnObj;
        Music.find(obj,
            function (err, results) {
                cb(results);
            }
        );
    }

    getSomeHitSort(cb){
      let returnObj;
      Music.find({idLike: { $gt: 5 }}, function (err, results) {
        cb(results);
      }).sort({'idLike':-1});
    }


    getSomeSong(cb){
      let returnObj;
      Music.find({"date": {'$gte': new Date('1/9/2015'),
      '$lt': new Date('11/12/2015')}},
      function (err, results) {
        cb(results);
      });
    }

    getSongNow(cb){
      let returnObj;
      let now = new Date();
      Music.find({"date": {'$lt': now}},
        function (err, results) {
          cb(results);
      });
    }

    // getSongDate(musicDate, cb){
    //   let returnObj;
    //   Music.find(musicDate, {"date": {'$gte': new Date('musicDate'),
    //   '$lt': new Date('11/11/2015')}},
    //   function (err, results) {
    //     cb(results);
    //   });
    // }

    getNewSong(cb){
      let returnObj;
      let cutoff = new Date();
      cutoff.setDate(cutoff.getDate()-5);
      Music.find({modificationDate: {$lt: cutoff}},
      function (err, results) {
        cb(results);
      });
    }


    getOne(obj, cb) {
        Music.findOne(obj,
            function (err, results) {
                cb(results);
            }
        );
    }

    create(obj, cb) {
        let returnObj;
        let createMusic = co(function*() {
            let NewMusic = new Music(obj);
            return yield Promise.resolve(NewMusic.save());
        });


        let findMusic = function (data) {
            Music.findOne({_id: data.musicId},
                function (err, results) {
                    if (!err) {
                        returnObj = {music: results, status: {success: 'Music was created', error: null}};
                        cb(returnObj)
                    }
                    else {
                        returnObj = {music: null, status: {success: null, error: err.message}};
                        cb(returnObj);
                    }
                });
        };


        createMusic
            .
            then(findMusic,
            function (err) {
                console.error(err.stack);
            });
    }


    update(obj, cb) {
        let returnObj;
        Music.findByIdAndUpdate(obj._id, {$set: obj}, function (err) {
            if (err) {
                returnObj = {music: null, status: {success: null, error: err.message}};
                cb(returnObj);
            }
            else {
                Music.findOne({_id: obj._id}, {}, function (err, music) {
                    if (err) {
                        returnObj = {music: null, status: {success: null, error: err.message}};
                        cb(returnObj);
                    } else {
                        returnObj = {music: music, status: {success: 'Music was updates', error: null}};
                        cb(returnObj);
                    }
                });
            }
        });
    }

    delete(id, cb) {
        let returnObj;
        Music.remove({_id: id}, function (err) {
            if (err)
                returnObj = {music: null, status: {success: null, error: err.message}};
            else {
                returnObj = {music: null, status: {success: 'Music was deleted.', error: null}};
            }
            cb(returnObj);
        });
    }


}
