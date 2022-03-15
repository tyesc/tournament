import { Request, Response } from 'express';

import * as participantService from '../services/participant';
import { BadRequest } from '../../utils/errors';
import { uuidV4Validate } from '../../utils/validate';
import {
  ParticipantInterface,
} from '../models/interfaces';


export const postParticipant = async (req: Request, res: Response) => {
  const participantToAdd: ParticipantInterface = req.body;
  const id = req.params['id'];

  if (!participantToAdd.name || !participantToAdd.elo || !Number.isInteger(participantToAdd.elo)) {
    throw BadRequest('wrong_name');
  }

  if (!uuidV4Validate(id)) {
    throw BadRequest('wrong_id');
  }

  const participant = await participantService.addParticipantToTournament(id, participantToAdd);

  res.status(201);
  res.send({ participant });
};

export const getAllParticipants = async (req: Request, res: Response) => {
  const id = req.params['id'];

  if (!uuidV4Validate(id)) {
    throw BadRequest('wrong_id');
  }

  const participants = await participantService.getAllParticipants(id);

  res.status(200);
  res.send(participants);
};

export const deleteParticipant = async (req: Request, res: Response) => {
  const id = req.params['id'];
  const participantId = req.params['participantId'];

  if (!uuidV4Validate(id) || !uuidV4Validate(participantId)) {
    throw BadRequest('wrong_id');
  }

  await participantService.deleteParticipant(id, participantId);

  res.status(204);
  res.send();
};
