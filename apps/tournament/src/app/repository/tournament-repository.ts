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

  public deleteTournament(tournamentId: string): void {
    this.tournaments.delete(tournamentId);
  }

  public addParticipant (tournamentId: string, participant: Participant): Tournament {
    const tournament = this.tournaments.get(tournamentId);
    tournament.participants.push(participant);

    return tournament;
  }

  public getParticipantByName(tournament: Tournament, participantName: string): Participant {
    const participant = tournament.participants.find(participant => participant.name === participantName);

    return participant;
  }

  public getAllParticipants(tournament: Tournament): Participant[] {
    return tournament.participants;
  }

  public deleteParticipant(tournament: Tournament, participantId: string): void {
    tournament.participants = tournament.participants.filter(item => item.id !== participantId);
  }

}
