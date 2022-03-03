import { Participant, Tournament } from '../api/api-model';

export class TournamentRepository {
  private tournaments = new Map<string, Tournament>();

  public saveTournament(tournament: Tournament): void {
    this.tournaments.set(tournament.id, tournament);
  }

  public getTournament(tournamentId: string): Tournament {
    return this.tournaments.get(tournamentId);
  }

  public getTournamentByName(tournamentName: string): Tournament {
    const tournament = [...this.tournaments.values()].find((item) => item.name === tournamentName);

    return tournament;
  }

  public addParticipant (tournamentId: string, participant: Participant): Tournament {
    const tournament = this.tournaments.get(tournamentId);
    console.log(tournament);


    return tournament;
  }

  // public getParticipantByName(participantName: string): Participant {
  //   const participant = [...this.tournaments.participants.values()].find((item) => item.name === participantName);

  //   return participant;
  // }

  public deleteTournament(tournamentId: string): void {
    this.tournaments.delete(tournamentId);
  }

}
