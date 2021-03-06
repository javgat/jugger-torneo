import { Equipo, ResultadoPartido, TiebreakingCriterion } from "./equipo";

export interface EnfrentamientoJSON {
	nombreEquipoA: string;
	nombreEquipoB: string;

	golesA: number;
	faltasA: number;

	golesB: number;
	faltasB: number;

	resultadoGanador: GanadorPartido;

	// Optional so it is compatible with versions <= v1.1.0
	selectWinner?: SelectWinner;

	faltas_descalificado_torneo: number;
	faltas_perder_partido: number;

	resultadosWritten: boolean;
}

/**
 * @class 
 * @classdesc Enfrentamiento represents a match between two teams (Equipo)
 */
export class Enfrentamiento {
	equipoA: Equipo;
	equipoB: Equipo;

	golesA: number;
	faltasA: number;

	golesB: number;
	faltasB: number;

	resultadoGanador: GanadorPartido;

	selectWinner: SelectWinner;

	private faltas_descalificado_torneo: number;
	private faltas_perder_partido: number;

	private resultadosWritten: boolean;

	constructor(equipoA: Equipo, equipoB: Equipo, faltas_descalificado_torneo: number, faltas_perder_partido: number) {
		this.equipoA = equipoA;
		this.equipoB = equipoB;

		this.golesA = 0;
		this.faltasA = 0;
		this.golesB = 0;
		this.faltasB = 0;
		this.resultadoGanador = GanadorPartido.EMPATE;
		this.resultadosWritten = false;
		this.selectWinner = SelectWinner.AUTOMATICO;

		this.faltas_descalificado_torneo = faltas_descalificado_torneo;
		this.faltas_perder_partido = faltas_perder_partido;
	}

	toJSON(): EnfrentamientoJSON {
		let enf: EnfrentamientoJSON = {
			nombreEquipoA: this.equipoA.getNombre(),
			nombreEquipoB: this.equipoB.getNombre(),

			golesA: this.golesA,
			faltasA: this.faltasA,

			golesB: this.golesB,
			faltasB: this.faltasB,

			resultadoGanador: this.resultadoGanador,
			selectWinner: this.selectWinner,

			faltas_descalificado_torneo: this.faltas_descalificado_torneo,
			faltas_perder_partido: this.faltas_perder_partido,

			resultadosWritten: this.resultadosWritten
		}
		return enf;
	}

	static createFromJSON(enfJs: EnfrentamientoJSON, eqs: Equipo[]): Enfrentamiento {
		let eqA = eqs.filter(eq => eq.getNombre() == enfJs.nombreEquipoA)[0];
		let eqB = eqs.filter(eq => eq.getNombre() == enfJs.nombreEquipoB)[0];
		let enf = new Enfrentamiento(eqA, eqB, enfJs.faltas_descalificado_torneo, enfJs.faltas_perder_partido);

		enf.golesA = enfJs.golesA;
		enf.faltasA = enfJs.faltasA;
		enf.golesB = enfJs.golesB;
		enf.faltasB = enfJs.faltasB;
		enf.resultadoGanador = enfJs.resultadoGanador;
		enf.selectWinner = enfJs.selectWinner || SelectWinner.AUTOMATICO;
		enf.faltas_descalificado_torneo = enfJs.faltas_descalificado_torneo;
		enf.faltas_perder_partido = enfJs.faltas_perder_partido;
		enf.resultadosWritten = enfJs.resultadosWritten;

		return enf;
	}

	setResultados(golesA: number, faltasA: number, golesB: number, faltasB: number) {
		this.golesA = golesA;
		this.faltasA = faltasA;
		this.golesB = golesB;
		this.faltasB = faltasB;
		this.resultadosWritten = true;
		this.selectWinner = SelectWinner.AUTOMATICO;
		this.calculaGanador();
	}

	unsetResultado() {
		this.resultadosWritten = false;
	}

	setForcedGanadorA() {
		this.selectWinner = SelectWinner.EQUIPOA;
		this.setForcedGanador(GanadorPartido.GANAA);
	}

	setForcedGanadorB() {
		this.selectWinner = SelectWinner.EQUIPOB;
		this.setForcedGanador(GanadorPartido.GANAB);
	}

	setForcedEmpate() {
		this.selectWinner = SelectWinner.EMPATE;
		this.setForcedGanador(GanadorPartido.EMPATE);
	}

	isResultadosSet(): boolean {
		return this.resultadosWritten;
	}

	isEquipoAWinner(): boolean {
		return this.resultadoGanador == GanadorPartido.GANAA && this.isResultadosSet();
	}

	isEquipoBWinner(): boolean {
		return this.resultadoGanador == GanadorPartido.GANAB && this.isResultadosSet();
	}

	isEmpate(): boolean {
		return this.resultadoGanador == GanadorPartido.EMPATE && this.isResultadosSet();
	}

	finPartido(): void | never {
		if (this.isResultadosSet()) {
			let resA: ResultadoPartido, resB: ResultadoPartido;
			if (this.isEquipoAWinner()) {
				resA = ResultadoPartido.VICTORIA;
				resB = ResultadoPartido.DERROTA;
			} else if (this.isEmpate()) {
				resA = ResultadoPartido.EMPATE;
				resB = ResultadoPartido.EMPATE;
			} else {
				resA = ResultadoPartido.DERROTA;
				resB = ResultadoPartido.VICTORIA;
			}
			this.equipoA.addPartidoData(resA, this.golesA, this.golesB, this.faltasA);
			this.equipoB.addPartidoData(resB, this.golesB, this.golesA, this.faltasB);
			this.equipoA.saveEnfrentamiento(this);
			this.equipoB.saveEnfrentamiento(this);
		} else {
			throw new Error("Resultado of Entrenamiento is not set yet");
		}
	}

	setFaltasDescalificadoTorneo(n: number) {
		this.faltas_descalificado_torneo = n;
	}

	setFaltasPerderPartido(n: number) {
		this.faltas_perder_partido = n;
	}

	private calculaGanador() {

		if (this.golesA > this.golesB) {
			this.resultadoGanador = GanadorPartido.GANAA;
		} else if (this.golesA < this.golesB) {
			this.resultadoGanador = GanadorPartido.GANAB;
		} else {
			this.resultadoGanador = GanadorPartido.EMPATE;
		}

		let totFaltasA = this.equipoA.getFaltas();
		let totFaltasB = this.equipoB.getFaltas();

		let isADescalificado = (totFaltasA >= this.faltas_descalificado_torneo) || (this.faltasA >= this.faltas_perder_partido);
		let isBDescalificado = (totFaltasB >= this.faltas_descalificado_torneo) || (this.faltasB >= this.faltas_perder_partido);
		if (isADescalificado && isBDescalificado) {
			this.resultadoGanador = GanadorPartido.EMPATE;
		} else if (isADescalificado) {
			this.resultadoGanador = GanadorPartido.GANAB;
		} else if (isBDescalificado) {
			this.resultadoGanador = GanadorPartido.GANAA;
		}
	}

	private setForcedGanador(ganador: GanadorPartido) {
		this.resultadoGanador = ganador;
		this.resultadosWritten = true;
	}

	private static matchGenBasicOrdered(clonEqs: Equipo[], faltas_descalificado: number, faltas_perder_partido: number): Enfrentamiento[] {
		let newEnfs: Enfrentamiento[] = [];
		while (clonEqs.length > 0) {
			let eqA: Equipo = clonEqs[0];
			for (let j = 1; j < clonEqs.length; j++) {
				let eqB: Equipo = clonEqs[j];
				if (!eqA.hasPlayedAgainst(eqB)) {
					clonEqs.splice(j, 1);
					clonEqs.shift();
					newEnfs.push(new Enfrentamiento(eqA, eqB, faltas_descalificado, faltas_perder_partido));
					break;
				}
				if (j == clonEqs.length - 1) {
					// if eqA has played against all, plays against the next one
					eqB = clonEqs[1];
					clonEqs.splice(0, 2);
					newEnfs.push(new Enfrentamiento(eqA, eqB, faltas_descalificado, faltas_perder_partido));
					break;
				}
			}
		}
		return newEnfs;
	}

	static assignateMatches(eqs: Equipo[], faltas_descalificado: number, faltas_perder_partido: number): Enfrentamiento[] {
		let freeEqs: Set<Equipo> = new Set<Equipo>();
		eqs.forEach((e) => {
			freeEqs.add(e);
		});
		let newEnfs: Enfrentamiento[] = [];
		let forbiddenEqsPrev: Map<string, Equipo[]> = new Map<string, Equipo[]>();
		let eqBeingForbid: Equipo; // Deepest (first) team being reformed
		for (let i = 0; i < eqs.length; i++) {
			let eqA: Equipo = eqs[i];
			let eqAFree = freeEqs.has(eqA);
			let found = false;
			if (eqAFree) {
				for (let j = 0; j < eqs.length; j++) {
					if (j == i) { // if it is the same team, go to the next
						continue;
					}
					let eqB: Equipo = eqs[j];
					let eqBFree = freeEqs.has(eqB);
					let eqForbidden = forbiddenEqsPrev.has(eqA.getNombre()) && forbiddenEqsPrev.get(eqA.getNombre()).some((e) => {
						return e.getNombre() == eqB.getNombre();
					});
					if (eqBFree) {
						if (!eqForbidden) {
							if (!eqA.hasPlayedAgainst(eqB)) {
								freeEqs.delete(eqA);
								freeEqs.delete(eqB);
								newEnfs.push(new Enfrentamiento(eqA, eqB, faltas_descalificado, faltas_perder_partido));
								found = true;
							}
						}
					}
					if (found) {
						break;
					}
				}
				if (!found) {
					if (newEnfs.length == 0) { // if the first team cant even create a match, its impossible
						return [];
					}
					if (eqBeingForbid != undefined && eqA.getNombre() == eqBeingForbid.getNombre()){
						// if we are going deeper unmatching another match, we clear current forbidden for the equipo
						forbiddenEqsPrev.set(eqA.getNombre(), []);
					}
					let oldEnf = newEnfs.pop();
					if (!forbiddenEqsPrev.has(oldEnf.equipoA.getNombre())){
						forbiddenEqsPrev.set(oldEnf.equipoA.getNombre(), []);
					}
					forbiddenEqsPrev.get(oldEnf.equipoA.getNombre()).push(oldEnf.equipoB);
					eqBeingForbid = oldEnf.equipoA;
					freeEqs.add(oldEnf.equipoA);
					freeEqs.add(oldEnf.equipoB);
					i = -1; // then i++ and i = 0
				}
			}
		}
		return newEnfs;
	}

	/**
	 * Divide teams in groups of two. If a group can't make matches for all teams, it's joined by the next group. If it's the
	 * last group, it's joined by the previous group. If it can't make matches still, returns empty array.
	 */
	private static matchGenComplexOrdered(eqs: Equipo[], faltas_descalificado: number, faltas_perder_partido: number): Enfrentamiento[] {
		let grupos_nenfs: Enfrentamiento[][] = [];
		let eqs_group: Equipo[] = [];
		while(eqs.length > 0){
			eqs_group.push(eqs.shift());
			eqs_group.push(eqs.shift());
			let enfs = this.assignateMatches(eqs_group, faltas_descalificado, faltas_perder_partido);
			if (enfs.length != 0){ // Could assignate matches
				grupos_nenfs.push(enfs);
				eqs_group = [];
			} else if (eqs.length == 0){ // No more free pairs forward
				if (grupos_nenfs.length == 0){ // No more groups backwards
					return [];
				}
				let last_genf = grupos_nenfs.pop();
				eqs.push(eqs_group.pop());
				eqs.push(eqs_group.pop());
				last_genf.forEach((ef) => {
					eqs_group.push(ef.equipoA);
					eqs_group.push(ef.equipoB);
				});
			}
		}
		let newEnfs: Enfrentamiento[] = [];
		grupos_nenfs.forEach((genf) => {
			genf.forEach((enf) => {
				newEnfs.push(enf);
			});
		});
		return newEnfs;
	}

	private static matchGenAllowRepetitionOrdered(eqs: Equipo[], faltas_descalificado: number, faltas_perder_partido: number): Enfrentamiento[] {
		let enfs: Enfrentamiento[] = [];
		for(let i = 0; i < (eqs.length-1); i = i + 2){
			enfs.push(new Enfrentamiento(eqs[i], eqs[i+1], faltas_descalificado, faltas_perder_partido));
		}
		return enfs;
	}

	static matchGenBasic(equipos: Equipo[], faltas_descalificado: number, faltas_perder_partido: number, tiebreakingCriteria: TiebreakingCriterion[]): Enfrentamiento[] {
		let clonEqs = [];
		for (let eq of equipos) {
			clonEqs.push(eq);
		}
		Equipo.sortTeamsRanking(clonEqs, tiebreakingCriteria);
		return this.matchGenBasicOrdered(clonEqs, faltas_descalificado, faltas_perder_partido);
	}

	static matchGenComplex(equipos: Equipo[], faltas_descalificado: number, faltas_perder_partido: number, tiebreakingCriteria: TiebreakingCriterion[]): Enfrentamiento[] {
		let clonEqs = [];
		for (let eq of equipos) {
			clonEqs.push(eq);
		}
		Equipo.sortTeamsRanking(clonEqs, tiebreakingCriteria);
		let enfs = this.matchGenComplexOrdered(clonEqs, faltas_descalificado, faltas_perder_partido);
		if (enfs.length == 0){
			enfs = this.matchGenBasic(equipos, faltas_descalificado, faltas_perder_partido, tiebreakingCriteria);
		}
		return enfs;
	}

	static matchGenAllowRepetition(equipos: Equipo[], faltas_descalificado: number, faltas_perder_partido: number, tiebreakingCriteria: TiebreakingCriterion[]): Enfrentamiento[] {
		let clonEqs = [];
		for (let eq of equipos) {
			clonEqs.push(eq);
		}
		Equipo.sortTeamsRanking(clonEqs, tiebreakingCriteria);
		let enfs = this.matchGenAllowRepetitionOrdered(clonEqs, faltas_descalificado, faltas_perder_partido);
		return enfs;
	}
}

export enum SelectWinner{
	AUTOMATICO,
	EQUIPOA,
	EQUIPOB,
	EMPATE
}

enum GanadorPartido {
	GANAA,
	EMPATE,
	GANAB,
}