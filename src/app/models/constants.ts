import { TiebreakingCriterion } from "./equipo";

// Number of faults that if it is reached by a team in the tournament, they are disqualified
export const DEFAULT_FALTAS_DESCALIFICADO_TORNEO: number = 5;
// Number of faults thart if it is reached by a team in a match, they lose the match
export const DEFAULT_FALTAS_PERDER_PARTIDO: number = 3;
// Default behaviour of avoiding o not repeated matches when generating new matches
export const DEFAULT_AVOID_REPEATED_MATCHES: boolean = true;
// Points that give winning a match
export const VALOR_VICTORIAS: number = 3;
// Points that give tying a match
export const VALOR_EMPATES: number = 1;
// Defaults options for tiebreaking criteria in case of tie in the ranking
export const DEFAULT_TIEBREAKING_CRITERIA: TiebreakingCriterion[] =
	[TiebreakingCriterion.FALTAS, TiebreakingCriterion.GOLAVERAGE, TiebreakingCriterion.ENFRENTAMIENTOSAGAINST];
// List with all possible options for tiebreaking criteria in case of tie in the ranking
export const ALL_TIEBREAKING_CRITERIA: TiebreakingCriterion[] =
	[TiebreakingCriterion.FALTAS, TiebreakingCriterion.GOLAVERAGE, TiebreakingCriterion.ENFRENTAMIENTOSAGAINST,
		TiebreakingCriterion.BUCHHOLZ, TiebreakingCriterion.MEDIANBUCHHOLZ];