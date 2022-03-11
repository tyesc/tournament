import { v4 as uuidv4 } from 'uuid';

import { TournamentRepository } from '../repository';
import { BadRequest, NotFound, ServerError } from '../../utils/errors';
import {
  TournamentToAdd,
  TournamentInterface,
} from '../models/interfaces';

const tournamentRepository = new TournamentRepository();

export const createTournament = async (tournamentDTO: TournamentToAdd): Promise<TournamentInterface> => {

  const exists = await tournamentRepository.getTournamentByName(tournamentDTO.name);

  if (exists) {
    throw BadRequest('already_exists');
  }

  const tournament = await tournamentRepository.saveTournament({
    ...tournamentDTO,
    id: uuidv4(),
    phases: [],
    participants: [],
  });

  return tournament;
};

export const getTournament = async (id: string): Promise<TournamentInterface> => {

  const tournament = await tournamentRepository.getTournament(id);

  if(!tournament) {
    throw NotFound('tournament_not_found');
  }

  return tournament;
};

export const deleteTournament = async (id: string) => {
  const tournament = await tournamentRepository.getTournament(id);

  if(!tournament) {
    throw NotFound('tournament_not_found');
  }

  const deleted = await tournamentRepository.deleteTournament(id);

  if(!deleted) {
    throw ServerError('cannot_delete_tournament');
  }
};
