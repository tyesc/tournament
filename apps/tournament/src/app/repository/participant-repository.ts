import {
  TournamentInterface,
  ParticipantInterface,
} from '../models/interfaces';
import { Tournament, Participant } from '../models';
import { NotFound } from '../../utils/errors';

export default class ParticipantRepository {

  public async createParticipant (participant: ParticipantInterface): Promise<ParticipantInterface> {
    return await new Participant(participant).save();
  }

  public async addParticipant (tournament: any, participant: ParticipantInterface): Promise<ParticipantInterface> {
    tournament.participants.push(participant);
    await tournament.save();

    return participant;
  }

  public async getParticipantByName(tournamentId: string, participantName: string): Promise<ParticipantInterface> {
    const tournament = await Tournament.findOne({ id: tournamentId }).populate('participants');

    const participant = tournament.participants.find(p => p.name === participantName);

    return participant;
  }

  public async getAllParticipants(tournament: any): Promise<ParticipantInterface[]> {
    const { participants } = await Tournament.findOne(tournament).populate('participants');

    return participants;
  }

  public async removeParticipant(tournamentId: string, participantId: string): Promise<TournamentInterface> {
    const tournament = await Tournament.findOne({ id: tournamentId }).populate('participants');
    tournament.participants = tournament.participants.filter(item => item.id !== participantId);

    return await tournament.save();
  }

}
