import express from 'express';

import users from './users';
import auth from './auth';
import music from './music';
import playlist from './playlist';
import albums from './albums';
import genre from './genre';
import performer from './performer';
let api = express.Router();

api.use('/users', users);
api.use('/auth', auth);
api.use('/music', music);
api.use('/playlist', playlist);
api.use('/albums', albums);
api.use('/genre', genre);
api.use('/performer', performer);
export default api;
