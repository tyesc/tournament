import {
  TournamentInterface,
  ParticipantInterface,
} from '../models/interfaces';
import { Tournament } from '../models';
import { NotFound } from '../../utils/errors';


export default class ParticipantRepository {

  public async addParticipant (tournament: TournamentInterface, participant: ParticipantInterface): Promise<ParticipantInterface> {

    return participant;
  }

  public async getParticipantByName(tournamentId: string, participantName: string): Promise<ParticipantInterface> {
    const tournament = await Tournament.findOne({ id: tournamentId }).populate('participants');

    if(!tournament) {
      throw NotFound('tournament_not_found');
    }

    const participant = tournament.participants.find(p => p.name === participantName);

    return participant;
  }

  public async getAllParticipants(tournamentId: string): Promise<ParticipantInterface[]> {
    return await Tournament.findOne({ id: tournamentId }).populate('participants').participants;
  }

  public async deleteParticipant(tournamentId: string, participantId: string): Promise<void> {
    const tournament = await Tournament.findOne({ id: tournamentId });

    if(!tournament) {
      throw NotFound('tournament_not_found');
    }

    tournament.participants = tournament.participants.filter(item => item.id !== participantId);
    await tournament.save();
  }

}
