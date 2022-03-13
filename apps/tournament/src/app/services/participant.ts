import { v4 as uuidv4 } from 'uuid';

import { TournamentRepository, ParticipantRepository } from '../repository';
import { BadRequest, NotFound, ServerError } from '../../utils/errors';
import {
  ParticipantInterface,
} from '../models/interfaces';

const tournamentRepository = new TournamentRepository();
const participantRepository = new ParticipantRepository();

export const addParticipantToTournament = async (id: string, participantDTO: ParticipantInterface) => {
  const tournament = await tournamentRepository.getTournament(id);

  if (!tournament) {
    throw NotFound('tournament_not_found');
  }

  const exists = await participantRepository.getParticipantByName(id, participantDTO.name);

  if (exists) {
    throw BadRequest('name_already_used');
  }

  const participant = await participantRepository.createParticipant({
    ...participantDTO,
    id: uuidv4(),
  });

  return await participantRepository.addParticipant(tournament, participant);
};

export const getAllParticipants = async (id: string) => {
  const tournament = await tournamentRepository.getTournament(id);

  if (!tournament) {
    throw NotFound('tournament_not_found');
  }

  return await participantRepository.getAllParticipants(tournament);
};

export const deleteParticipant = async (id: string, participantId: string) => {
  const tournament = await tournamentRepository.getTournament(id);

  if (!tournament) {
    throw NotFound('tournament_not_found');
  }

  const deleted = await participantRepository.removeParticipant(id, participantId);

  if(!deleted) {
    throw ServerError('cannot_delete_tournament');
  }
};
