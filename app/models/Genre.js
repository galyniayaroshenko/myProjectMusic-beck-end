import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let Genre = new Schema({
  title: {type: String, default: null},
  img: {type: String, default: null}

},{
    collection: 'genre',
    _id: true,
    versionKey: false
});

export default mongoose.model('Genre', Genre);
