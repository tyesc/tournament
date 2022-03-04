import * as express from 'express';
import {
  getTournament,
  postTournament,
  deleteTournament,
  postParticipants,
  getAllParticipants,
  deleteParticipant
} from './app/api/tournament-api';
import * as bodyParser from 'body-parser';

export const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to tournament!' });
});

app.post('/api/tournaments', postTournament);
app.get('/api/tournaments/:id', getTournament);
app.delete('/api/tournaments/:id', deleteTournament);

// Participants
app.post('/api/tournaments/:id/participants', postParticipants);
app.get('/api/tournaments/:id/participants', getAllParticipants);
app.delete('/api/tournaments/:id/participants/:participantId', deleteParticipant);
