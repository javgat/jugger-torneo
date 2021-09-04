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
}

export enum ResultadoPartido{
	VICTORIA,
	EMPATE,
	DERROTA
}