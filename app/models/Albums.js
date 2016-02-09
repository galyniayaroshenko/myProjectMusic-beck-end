import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let Albums = new Schema({
  title: {type: String, default: null},
  img: {type: String, default: null},
  description: {type: String, default: null},
  idPerformer: {type: String, default: null},
  idGenre: {type: String, default: null}

},{
    collection: 'albums',
    _id: true,
    versionKey: false
});

export default mongoose.model('Albums', Albums);
