import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let Performer = new Schema({
  title: {type: String, default: null},
  img: {type: String, default: null}
},{
    collection: 'performer',
    _id: true,
    versionKey: false
});

export default mongoose.model('Performer', Performer);
