import { Tournament } from '../api/api-model';

export class TournamentRepository {
  private tournaments = new Map<string, Tournament>();

  public saveTournament(tournament: Tournament): void {
    this.tournaments.set(tournament.id, tournament);
  }

  public getTournament(tournamentId: string): Tournament {
    return this.tournaments.get(tournamentId);
  }

  public getTournamentByName(tournamentName: string): Tournament {
    const touranment = [...this.tournaments.values()].find((item) => item.name === tournamentName);

    return touranment;
  }

  public deleteTournament(tournamentId: string): void {
    this.tournaments.delete(tournamentId);
  }

}
