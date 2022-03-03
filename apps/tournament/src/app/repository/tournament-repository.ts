import { Tournament } from '../api/api-model';

export class TournamentRepository {
  private tournaments = new Map<string, Tournament>();

  public saveTournament(tournament: Tournament): void {
    this.tournaments.set(tournament.id, tournament);
  }

  public getTournament(tournamentId: string): Tournament {
    return this.tournaments.get(tournamentId);
  }

  public tournamentNameExists(tournamentName: string): boolean {
    let exists = [];

    this.tournaments.forEach(item => {
      if (item.name === tournamentName) {
        exists.push('true')
      }

      exists.push('false')
    });

    if(exists.find((i) => i = 'true')) return true

    return false
  }
}
