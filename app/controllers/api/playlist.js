import express from 'express';
import PlaylistRepositoryClass from '../../repository/PlaylistRepository';

let playlist = express.Router();
let PlaylistRepository = new PlaylistRepositoryClass();


playlist.post('/', (req, res) => {
  let playlist = req.body.playlist;
  PlaylistRepository.create(playlist, function (result) {
      res.json(result)
  });
});

playlist.get('/', (req, res) => {
  PlaylistRepository.getAll(function (result) {
      res.json({playlist: result, status: {success: 'Ok', error: null}});
  });
});

playlist.get('/:title', (req, res)  => {
  let title = req.params.title;
  PlaylistRepository.getOne({title: title}, function (result) {
    res.json({playlist: result, status: {success: 'Ok', error: null}});
  });
});

playlist.delete('/:id', (req, res) => {
  let idPlaylist= req.params.id;
  PlaylistRepository.delete(idPlaylist, function (result) {
    res.json(result);
  });
});

playlist.put('/:id', (req, res) => {
  let playlist = req.body.playlist;
  playlist._id = req.params.id;
  PlaylistRepository.update(playlist, function (result) {
    res.json(result);
  });
});



export default playlist;
