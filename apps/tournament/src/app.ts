import express from 'express';
import bodyParser from 'body-parser';

import {
  getTournament,
  postTournament,
  deleteTournament,
} from './app/controllers/tournament-controller';
import {
  postParticipant,
  getAllParticipants,
  deleteParticipant
} from './app/controllers/participant-controller';
import { catchError } from './utils/errors';

export const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to tournament!' });
});

app.post('/api/tournaments', catchError(postTournament));
app.get('/api/tournaments/:id', catchError(getTournament));
app.delete('/api/tournaments/:id', catchError(deleteTournament));

// Participants
app.post('/api/tournaments/:id/participants', catchError(postParticipant));
app.get('/api/tournaments/:id/participants', catchError(getAllParticipants));
app.delete('/api/tournaments/:id/participants/:participantId', catchError(deleteParticipant));
