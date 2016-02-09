import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let Playlist = new Schema({
  title: {type: String, default: null},
  idUser: {type: String, default: null},
  idMusic: {type: String, default: null},
  idGenre: {type: String, default: null},
  idPerformer: {type: String, default: null}

},{
    collection: 'playlist',
    _id: true,
    versionKey: false
});

export default mongoose.model('Playlist', Playlist);
