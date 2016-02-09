import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let Music = new Schema({
  title: {type: String, default: null},
  description: {type: String, default: null},
  img : {type: String, default: null},
  song: {type: String, default: null},
  visible: {type: Boolean, default: null},
  idHit: {type: String, default: null},
  idNewsond: {type: String, default: null},
  idLike: {type: Number, default: null},
  idGenre : {type: String, default: null},
  idPerformer : {type: String, default: null},
  idPlaylist: {type: String, default: null},
  idAlbums: {type: String, default: null},
	date: {type: String, default: null},
  url: {type: String, default: null}
},{
    collection: 'music',
    _id: true,
    versionKey: false
});

export default mongoose.model('Music', Music);
