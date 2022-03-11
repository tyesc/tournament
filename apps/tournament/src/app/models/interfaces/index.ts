export interface MatchInterface {
  participant1: ParticipantInterface;
  participant2: ParticipantInterface;
}

export interface ParticipantInterface {
  id: string;
  name: string;
  elo: number;
}

export enum TournamentPhaseType {
  SingleBracketElimination = 'SingleBracketElimination',
  SwissRound = 'SwissRound',
}

export interface PhaseInterface {
  type: TournamentPhaseType;
}

export interface RoundInterface {
  name: string;
  matches: MatchInterface[];
}

export interface TournamentToAdd {
  name: string;
}

export interface TournamentInterface {
  id: string;
  name: string;

  phases: PhaseInterface[];
  participants: ParticipantInterface[];
}
