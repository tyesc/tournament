import { Request, Response } from 'express';
import { TournamentRepository } from '../repository/tournament-repository';
import { CustomError } from '../../utils/errors';
import { TournamentToAdd } from './api-model';
import { v4 as uuidv4 } from 'uuid';

const tournamentRepository = new TournamentRepository();

export const postTournament = (req: Request, res: Response) => {
  const tournamentToAdd: TournamentToAdd = req.body;

  if (!tournamentToAdd.name) {
    throw new CustomError('Bad Request', 400, 'empty_name');
  }

  const nameExists = tournamentRepository.getTournamentByName(tournamentToAdd.name);

  if (nameExists) {
    throw new CustomError('Bad Request', 400, 'name_already_used');
  }

  const tournament = { id: uuidv4(), name: tournamentToAdd.name, phases: [], participants: [] };
  tournamentRepository.saveTournament(tournament);

  res.status(201);
  res.send({ id: tournament.id });
};

export const getTournament = (req: Request, res: Response) => {
  const id = req.params['id'];

  const tournament = tournamentRepository.getTournament(id);

  if(!tournament) {
    throw new CustomError('Not found', 404, 'tournament not found');
  }

  res.status(200);
  res.send(tournament);
};

export const deleteTournament = (req: Request, res: Response) => {
  const id = req.params['id'];

  tournamentRepository.deleteTournament(id);

  res.status(200);
  res.send({ deleted: true });
};
