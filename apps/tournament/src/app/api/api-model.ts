export enum TournamentPhaseType {
  SingleBracketElimination = 'SingleBracketElimination',
  SwissRound = 'SwissRound',
}

export interface TournamentPhase {
  type: TournamentPhaseType;
}

export interface Participant {
  id: string;
  name: string;
  elo: number;
}

export interface TournamentToAdd {
  name: string;
}

export interface Tournament {
  id: string;
  name: string;

  phases: TournamentPhase[];
  participants: Participant[];
}

export interface Round {
  name: string;
  matches: Match[];
}

export interface Match {
  participant1: Participant;
  participant2: Participant;
}
