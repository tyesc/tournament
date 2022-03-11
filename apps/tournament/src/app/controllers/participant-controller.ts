import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { ParticipantRepository, TournamentRepository } from '../repository';
import { BadRequest, NotFound } from '../../utils/errors';
import {
  ParticipantInterface,
} from '../models/interfaces';

const participantRepository = new ParticipantRepository();
const tournamentRepository = new TournamentRepository();

export const postParticipant = async (req: Request, res: Response) => {
  const participantToAdd: ParticipantInterface = req.body;
  const id = req.params['id'];

  if (!participantToAdd.name || !participantToAdd.elo || !Number.isInteger(participantToAdd.elo)) {
    throw BadRequest('wrong_name');
  }

  const exists = await participantRepository.getParticipantByName(id, participantToAdd.name);

  if (exists) {
    throw BadRequest('name_already_used');
  }

  const tournament = await tournamentRepository.getTournament(id);

  if (!tournament) {
    throw NotFound('tournament_not_found');
  }

  const participant = { id: uuidv4(), name: participantToAdd.name, elo: participantToAdd.elo };
  await participantRepository.addParticipant(tournament, participant);

  res.status(201);
  res.send({ id: participant.id });
};

export const getAllParticipants = async (req: Request, res: Response) => {
  const id = req.params['id'];

  const participants = await participantRepository.getAllParticipants(id);

  res.status(200);
  res.send(participants);
};

export const deleteParticipant = async (req: Request, res: Response) => {
  const id = req.params['id'];
  const participantId = req.params['participantId'];

  await participantRepository.deleteParticipant(id, participantId);

  res.status(204);
  res.send();
};