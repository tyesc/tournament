import {
  TournamentInterface,
} from '../models/interfaces';
import { Tournament } from '../models';

import { Query, Document } from 'mongoose';

export default class TournamentRepository {

  public async saveTournament(tournament: TournamentInterface): Promise<TournamentInterface> {
    return await new Tournament(tournament).save();
  }

  public async getTournament(tournamentId: string): Promise<Query<any, Document<TournamentInterface>>> {
    return await Tournament.findOne({ id: tournamentId });
  }

  public async getTournamentByName(tournamentName: string): Promise<TournamentInterface> {
    return await Tournament.findOne({ name: tournamentName });
  }

  public async deleteTournament(tournamentId: string): Promise<TournamentInterface> {
    return await Tournament.findOneAndDelete({ id: tournamentId });
  }

}
