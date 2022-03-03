import * as express from 'express';
import { getTournament, postTournament, deleteTournament } from './app/api/tournament-api';
import { postParticipants } from './app/api/participant-api';
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
