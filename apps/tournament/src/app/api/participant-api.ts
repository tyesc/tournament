import { Request, Response } from 'express';
import { TournamentRepository } from '../repository/tournament-repository';
import { CustomError } from '../../utils/errors';
import { Participant } from './api-model';
import { v4 as uuidv4 } from 'uuid';

const tournamentRepository = new TournamentRepository();

export const postParticipants = (req: Request, res: Response) => {
  const participantToAdd: Participant = req.body;
  const id = req.params['id'];

  if (!participantToAdd.name) {
    throw new CustomError('Bad Request', 400, 'empty_name');
  }

  const tournament = tournamentRepository.getTournament(id);

  if (!tournament) {
    throw new CustomError('Not Found', 404, 'tournament_not_found');
  }

  const participant = { id: uuidv4(), name: participantToAdd.name, elo: participantToAdd.elo };
  tournamentRepository.addParticipant(tournament.id, participant);

  res.status(201);
  res.send({ created: true });
};

// export const deleteParticipant = (req: Request, res: Response) => {
//   const id = req.params['id'];

//   participantRepository.deleteParticipant(id);

//   res.status(200);
//   res.send({ deleted: true });
// };
