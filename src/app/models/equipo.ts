import { FALTAS_DESCALIFICADO_TORNEO, VALOR_EMPATES, VALOR_VICTORIAS } from "./constants";

export class Equipo{
	private nombre: string;

	private golesAFavor: number;
	private golesEnContra: number;
	private victorias: number;
	private empates: number;
	private derrotas: number;
	private faltas: number;

	constructor(nombre: string){
		this.nombre = nombre;
		this.golesAFavor = 0;
		this.golesEnContra = 0;
		this.victorias = 0;
		this.empates = 0;
		this.derrotas = 0;
		this.faltas = 0;
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
		return this.faltas >= FALTAS_DESCALIFICADO_TORNEO;
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
			return this.getGolAverage() - other.getGolAverage();
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