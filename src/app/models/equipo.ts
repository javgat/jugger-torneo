import { VALOR_EMPATES, VALOR_VICTORIAS } from "./constants";
import { Enfrentamiento, EnfrentamientoJSON } from "./enfrentamiento";

export interface EquipoJSON {
	// unique id
	nombre: string;

	golesAFavor: number;
	golesEnContra: number;
	victorias: number;
	empates: number;
	derrotas: number;
	faltas: number;
	enfrentamientos: EnfrentamientoJSON[];
	faltas_descalificado: number;
}

/**
 * @class
 * @classdesc Equipo represents a team that is participating in the tournament
 */
export class Equipo {
	// unique id
	private nombre: string;

	private golesAFavor: number;
	private golesEnContra: number;
	private victorias: number;
	private empates: number;
	private derrotas: number;
	private faltas: number;
	private enfrentamientos: Enfrentamiento[];
	private faltas_descalificado: number;

	constructor(nombre: string, faltas_descalificado: number) {
		this.enfrentamientos = [];
		this.nombre = nombre;
		this.golesAFavor = 0;
		this.golesEnContra = 0;
		this.victorias = 0;
		this.empates = 0;
		this.derrotas = 0;
		this.faltas = 0;
		this.faltas_descalificado = faltas_descalificado;
	}

	toJSON(): EquipoJSON {
		let enfsJson: EnfrentamientoJSON[] = [];
		for (let enf of this.enfrentamientos) {
			enfsJson.push(enf.toJSON());
		}
		let eq: EquipoJSON = {
			nombre: this.nombre,

			golesAFavor: this.golesAFavor,
			golesEnContra: this.golesEnContra,
			victorias: this.victorias,
			empates: this.empates,
			derrotas: this.derrotas,
			faltas: this.faltas,
			enfrentamientos: enfsJson,
			faltas_descalificado: this.faltas_descalificado,
		}
		return eq;
	}

	private static beginCreationFromJSON(eqJs: EquipoJSON): Equipo {
		let eq = new Equipo(eqJs.nombre, eqJs.faltas_descalificado);
		eq.golesAFavor = eqJs.golesAFavor;
		eq.golesEnContra = eqJs.golesEnContra;
		eq.victorias = eqJs.victorias;
		eq.empates = eqJs.empates;
		eq.derrotas = eqJs.derrotas;
		eq.faltas = eqJs.faltas;
		return eq;
	}

	private static finishCreationFromJSON(eqJs: EquipoJSON, eq: Equipo, eqs: Equipo[]) {
		for (let enfJs of eqJs.enfrentamientos) {
			// These enfrentamientos will be duplicated in the other equipo, but 
			// they are not the current enfrentamientos so it is not a problem
			eq.enfrentamientos.push(Enfrentamiento.createFromJSON(enfJs, eqs));
		}
		return eq;
	}

	static createFromJSONS(eqsJs: EquipoJSON[]): Equipo[] {
		let eqs: Equipo[] = [];
		for (let eqJs of eqsJs) {
			eqs.push(this.beginCreationFromJSON(eqJs));
		}
		for (let i = 0; i < eqs.length; i++) {
			this.finishCreationFromJSON(eqsJs[i], eqs[i], eqs);
		}
		return eqs;
	}

	getNombre(): string {
		return this.nombre;
	}

	getGolesAFavor(): number {
		return this.golesAFavor;
	}

	getGolesEnContra(): number {
		return this.golesEnContra;
	}

	getGolAverage(): number {
		return this.getGolesAFavor() - this.getGolesEnContra();
	}

	getVictorias(): number {
		return this.victorias;
	}

	getEmpates(): number {
		return this.empates;
	}

	getDerrotas(): number {
		return this.derrotas;
	}

	getFaltas(): number {
		return this.faltas;
	}

	getPuntuacion(): number {
		return this.victorias * VALOR_VICTORIAS + this.empates * VALOR_EMPATES;
	}

	isDescalificado(): boolean {
		return this.faltas >= this.faltas_descalificado;
	}

	setFaltasDescalificado(n: number) {
		this.faltas_descalificado = n;
	}

	saveEnfrentamiento(e: Enfrentamiento) {
		this.enfrentamientos.push(e);
	}

	addPartidoData(resultado: ResultadoPartido, golesAFavor: number, golesEnContra: number, faltas: number) {
		if (resultado == ResultadoPartido.VICTORIA) {
			this.victorias++;
		} else if (resultado == ResultadoPartido.EMPATE) {
			this.empates++;
		} else {
			this.derrotas++;
		}
		this.golesAFavor += golesAFavor;
		this.golesEnContra += golesEnContra;
		this.faltas += faltas;
	}

	getEnfrentamientosAgainst(e: Equipo): Enfrentamiento[] {
		return this.enfrentamientos.filter((enf) => {
			return enf.equipoA == e || enf.equipoB == e;
		});
	}

	hasPlayedAgainst(e: Equipo): boolean {
		return this.getEnfrentamientosAgainst(e).length > 0;
	}

	getNumberEnfrentamientos(): number{
		return this.enfrentamientos.length;
	}

	/**
	 * Compares to other Equipo. this - other.
	 * Negative if this is smaller. Smaller means goes last.
	 */
	compareTo(other: Equipo, tiebreakingCriteria: TiebreakingCriterion[]): number {
		if (this.isDescalificado() && other.isDescalificado()) {
			return 0;
		}
		if (this.isDescalificado()) {
			return -1;
		}
		if (other.isDescalificado()) {
			return 1;
		}
		let puntuacion = this.getPuntuacion();
		let opunt = other.getPuntuacion();
		if (puntuacion == opunt) {
			for (let tc of tiebreakingCriteria) {
				let difVal;
				switch(tc) {
					case TiebreakingCriterion.FALTAS: {
						difVal = Equipo.tieBreakFaltas(this, other);
						break;
					}
					case TiebreakingCriterion.GOLAVERAGE: {
						difVal = Equipo.tieBreakGolaverage(this, other);
						break;
					}	
					case TiebreakingCriterion.ENFRENTAMIENTOSAGAINST: {
						difVal = Equipo.tieBreakEnfrentamientosAgainst(this, other);
						break;
					}
					default: {
						difVal = 0;
						break;
					}
				}
				if (difVal != 0){
					return difVal;
				}
			}
			return 0;
		} else {
			return puntuacion - opunt;
		}
	}

	static sortTeamsRanking(eqs: Equipo[], tiebreakingCriteria: TiebreakingCriterion[]) {
		eqs.sort((ea, eb) => {
			return eb.compareTo(ea, tiebreakingCriteria); // reverse order, so large goes first
		});
	}

	private static tieBreakFaltas(that: Equipo, other: Equipo) {
		let faltas = that.getFaltas();
		let ofalts = other.getFaltas();
		return ofalts - faltas; // less faltas => first
	}

	private static tieBreakGolaverage(that: Equipo, other: Equipo) {
		let golaver = that.getGolAverage();
		let ogola = other.getGolAverage();
		return golaver - ogola;
	}

	private static tieBreakEnfrentamientosAgainst(that: Equipo, other: Equipo) {
		let enfs = that.getEnfrentamientosAgainst(other);
		if (enfs.length > 0) {
			let sumVics = 0;
			enfs.forEach((enf) => {
				let sumandoVicEnf: number;
				if (enf.isEmpate()) {
					sumandoVicEnf = 0;
				} else if (enf.isEquipoAWinner()) {
					sumandoVicEnf = (enf.equipoA == that) ? 1 : -1;
				} else {
					sumandoVicEnf = (enf.equipoA == that) ? -1 : 1;
				}
				sumVics += sumandoVicEnf;
			});
			return sumVics;
		}
		return 0;
	}
}

export enum ResultadoPartido {
	VICTORIA,
	EMPATE,
	DERROTA
}

export enum TiebreakingCriterion {
	FALTAS,
	GOLAVERAGE,
	ENFRENTAMIENTOSAGAINST
}