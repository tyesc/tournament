import { Request, Response } from 'express';
import { TournamentRepository } from '../repository/tournament-repository';
import { CustomError } from '../../utils/errors';
import { TournamentToAdd, Participant, TournamentPhaseType, TournamentPhase } from './api-model';
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


// Participants
export const postParticipants = (req: Request, res: Response) => {
  const participantToAdd: Participant = req.body;
  const id = req.params['id'];

  if (!participantToAdd.name || !participantToAdd.elo || !Number.isInteger(participantToAdd.elo)) {
    throw new CustomError('Bad Request', 400);
  }

  const tournament = tournamentRepository.getTournament(id);

  if (!tournament) {
    throw new CustomError('Not Found', 404, 'tournament_not_found');
  }

  const nameExists = tournamentRepository.getParticipantByName(tournament, participantToAdd.name);

  if (nameExists) {
    throw new CustomError('Bad Request', 400, 'name_already_used');
  }

  const participant = { id: uuidv4(), name: participantToAdd.name, elo: participantToAdd.elo };
  tournamentRepository.addParticipant(tournament.id, participant);

  res.status(201);
  res.send({ id: participant.id });
};

export const getAllParticipants = (req: Request, res: Response) => {
  const id = req.params['id'];

  const tournament = tournamentRepository.getTournament(id);

  if(!tournament) {
    throw new CustomError('Not found', 404, 'tournament not found');
  }

  const participants = tournamentRepository.getAllParticipants(tournament);

  res.status(200);
  res.send(participants);
};

export const deleteParticipant = (req: Request, res: Response) => {
  const id = req.params['id'];
  const participantId = req.params['participantId'];

  const tournament = tournamentRepository.getTournament(id);

  if(!tournament) {
    throw new CustomError('Not found', 404, 'tournament not found');
  }

  tournamentRepository.deleteParticipant(tournament, participantId);

  res.status(204);
  res.send();
};



// Phases
export const postPhases = (req: Request, res: Response) => {
  const phaseToAdd: TournamentPhase = req.body;
  const id = req.params['id'];

  if (!phaseToAdd.type || !Object.values(TournamentPhaseType).includes(phaseToAdd.type)) {
    throw new CustomError('Bad Request', 400);
  }

  const tournament = tournamentRepository.getTournament(id);

  if (!tournament) {
    throw new CustomError('Not Found', 404, 'tournament_not_found');
  }

  if (phaseToAdd.type === TournamentPhaseType.SingleBracketElimination && tournament.phases.length > 0 ) {
    throw new CustomError('Bad Request', 400, 'only_one_phase_allowed');
  }

  const phase = { id: uuidv4(), type: phaseToAdd.type };
  tournamentRepository.addPhase(tournament.id, phase);

  res.status(201);
  res.send({ id: phase.id });
};

export const getAllPhases = (req: Request, res: Response) => {
  const id = req.params['id'];

  const tournament = tournamentRepository.getTournament(id);

  if(!tournament) {
    throw new CustomError('Not found', 404, 'tournament not found');
  }

  const phases = tournamentRepository.getAllPhases(tournament);

  res.status(200);
  res.send(phases);
};

export const deletePhase = (req: Request, res: Response) => {
  const id = req.params['id'];
  const phaseId = req.params['phaseId'];

  const tournament = tournamentRepository.getTournament(id);

  if(!tournament) {
    throw new CustomError('Not found', 404, 'tournament not found');
  }

  tournamentRepository.deletePhase(tournament, phaseId);

  res.status(204);
  res.send();
};