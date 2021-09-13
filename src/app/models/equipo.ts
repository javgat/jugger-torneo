import { VALOR_EMPATES, VALOR_VICTORIAS } from "./constants";
import { Enfrentamiento } from "./enfrentamiento";

/**
 * @class
 * @classdesc Equipo represents a team that is participating in the tournament
 */
export class Equipo{
	private nombre: string;

	private golesAFavor: number;
	private golesEnContra: number;
	private victorias: number;
	private empates: number;
	private derrotas: number;
	private faltas: number;
	private enfrentamientos: Enfrentamiento[];
	private faltas_descalificado: number;

	constructor(nombre: string, faltas_descalificado: number){
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

	getNombre(): string {
		return this.nombre;
	}

	getGolesAFavor(): number {
		return this.golesAFavor;
	}

	getGolesEnContra(): number {
		return this.golesEnContra;
	}

	getGolAverage(): number{
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
		return this.victorias*VALOR_VICTORIAS + this.empates * VALOR_EMPATES;	
	}

	isDescalificado(): boolean{
		return this.faltas >= this.faltas_descalificado;
	}

	setFaltasDescalificado(n: number){
		this.faltas_descalificado = n;
	}

	saveEnfrentamiento(e: Enfrentamiento){
		this.enfrentamientos.push(e);
	}

	addPartidoData(resultado: ResultadoPartido, golesAFavor: number, golesEnContra: number, faltas: number){
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

	getEnfrentamientosAgainst(e: Equipo): Enfrentamiento[]{
		return this.enfrentamientos.filter((enf) => {
			return enf.equipoA == e || enf.equipoB == e;
		});
	}

	hasPlayedAgainst(e: Equipo): boolean{
		return this.getEnfrentamientosAgainst(e).length > 0;
	}

	/**
	 * Compares to other Equipo. this - other.
	 * Negative if this is smaller. Smaller means goes last.
	 */
	compareTo(other: Equipo): number{
		if (this.isDescalificado() && other.isDescalificado()){
			return 0;
		}
		if (this.isDescalificado()){
			return -1;
		}
		if (other.isDescalificado()){
			return 1;
		}
		let puntuacion = this.getPuntuacion();
		let opunt = other.getPuntuacion();
		if (puntuacion == opunt){
			let faltas = this.getFaltas();
			let ofalts = other.getFaltas();
			if (faltas == ofalts){
				let golaver = this.getGolAverage();
				let ogola = other.getGolAverage();
				if (golaver == ogola){
					let enfs = this.getEnfrentamientosAgainst(other);
					if (enfs.length > 0){
						if (enfs[0].isEmpate()) {
							return 0;
						} else if (enfs[0].isEquipoAWinner()){
							return (enfs[0].equipoA == this) ? 1 : -1;
						} else {
							return (enfs[0].equipoA == this) ? -1 : 1;
						}
					}
					return 0;
				}
				return this.getGolAverage() - other.getGolAverage();
			}
			return ofalts - faltas; // less faltas => first
		}else{
			return puntuacion - opunt;
		}
	}
}

export enum ResultadoPartido{
	VICTORIA,
	EMPATE,
	DERROTA
}