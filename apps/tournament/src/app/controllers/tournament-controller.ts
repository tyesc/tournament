import { Request, Response } from 'express';

import * as tournamentService from '../services/tournament';
import { BadRequest } from '../../utils/errors';
import {
  TournamentToAdd,
} from '../models/interfaces';

export const postTournament = async (req: Request, res: Response) => {
  const tournamentToAdd: TournamentToAdd = req.body;

  if (!tournamentToAdd.name) {
    throw BadRequest('empty_name');
  }

  const { id } = await tournamentService.createTournament(tournamentToAdd);

  res.status(201);
  res.send({ id });
};

export const getTournament = async (req: Request, res: Response) => {
  const id = req.params['id'];

  if (!id) {
    throw BadRequest('wrong_id');
  }

  const tournament = await tournamentService.getTournament(id);

  res.status(200);
  res.send(tournament);
};

export const deleteTournament = async (req: Request, res: Response) => {
  const id = req.params['id'];

  if (!id) {
    throw BadRequest('wrong_id');
  }

  await tournamentService.deleteTournament(id);

  res.status(200);
  res.send({ deleted: true });
};
