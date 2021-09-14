import { Equipo, ResultadoPartido } from "./equipo";

export interface EnfrentamientoJSON{
	nombreEquipoA: string;
	nombreEquipoB: string;

	golesA: number;
	faltasA: number;

	golesB: number;
	faltasB: number;

	resultadoGanador: GanadorPartido;
	
	faltas_descalificado_torneo: number;
	faltas_perder_partido: number;

	resultadosWritten: boolean;
}

/**
 * @class 
 * @classdesc Enfrentamiento represents a match between two teams (Equipo)
 */
export class Enfrentamiento{
	equipoA: Equipo;
	equipoB: Equipo;

	golesA: number;
	faltasA: number;

	golesB: number;
	faltasB: number;

	resultadoGanador: GanadorPartido;
	
	private faltas_descalificado_torneo: number;
	private faltas_perder_partido: number;

	private resultadosWritten: boolean;

	constructor(equipoA: Equipo, equipoB: Equipo, faltas_descalificado_torneo: number, faltas_perder_partido: number){
		this.equipoA = equipoA;
		this.equipoB = equipoB;
		
		this.golesA = 0;
		this.faltasA = 0;
		this.golesB = 0;
		this.faltasB = 0;
		this.resultadoGanador = GanadorPartido.EMPATE;
		this.resultadosWritten = false;

		this.faltas_descalificado_torneo = faltas_descalificado_torneo;
		this.faltas_perder_partido = faltas_perder_partido;
	}

	toJSON(): EnfrentamientoJSON{
		let enf: EnfrentamientoJSON = {
			nombreEquipoA: this.equipoA.getNombre(),
			nombreEquipoB: this.equipoB.getNombre(),
		
			golesA: this.golesA,
			faltasA: this.faltasA,
		
			golesB: this.golesB,
			faltasB: this.faltasB,
		
			resultadoGanador: this.resultadoGanador,
			
			faltas_descalificado_torneo: this.faltas_descalificado_torneo,
			faltas_perder_partido: this.faltas_perder_partido,
		
			resultadosWritten: this.resultadosWritten
		}
		return enf;
	}

	static createFromJSON(enfJs: EnfrentamientoJSON, eqs: Equipo[]): Enfrentamiento{
		let eqA = eqs.filter(eq => eq.getNombre() == enfJs.nombreEquipoA)[0];
		let eqB = eqs.filter(eq => eq.getNombre() == enfJs.nombreEquipoB)[0];
		let enf = new Enfrentamiento(eqA, eqB, enfJs.faltas_descalificado_torneo, enfJs.faltas_perder_partido);
	
		enf.golesA = enfJs.golesA;
		enf.faltasA = enfJs.faltasA;
		enf.golesB = enfJs.golesB;
		enf.faltasB = enfJs.faltasB;
		enf.resultadoGanador = enfJs.resultadoGanador;
		enf.faltas_descalificado_torneo = enfJs.faltas_descalificado_torneo;
		enf.faltas_perder_partido = enfJs.faltas_perder_partido;
		enf.resultadosWritten = enfJs.resultadosWritten;

		return enf;
	}

	setResultados(golesA: number, faltasA: number, golesB:number, faltasB: number){
		this.golesA = golesA;
		this.faltasA = faltasA;
		this.golesB = golesB;
		this.faltasB = faltasB;
		this.resultadosWritten = true;
		this.calculaGanador();
	}

	unsetResultado(){
		this.resultadosWritten = false;
	}

	setForcedGanadorA(){
		this.setForcedGanador(GanadorPartido.GANAA);
	}

	setForcedGanadorB(){
		this.setForcedGanador(GanadorPartido.GANAB);
	}

	setForcedEmpate(){
		this.setForcedGanador(GanadorPartido.EMPATE);
	}

	isResultadosSet(): boolean {
		return this.resultadosWritten;
	}

	isEquipoAWinner(): boolean{
		return this.resultadoGanador == GanadorPartido.GANAA && this.isResultadosSet();
	}

	isEquipoBWinner(): boolean{
		return this.resultadoGanador == GanadorPartido.GANAB && this.isResultadosSet();
	}

	isEmpate(): boolean{
		return this.resultadoGanador == GanadorPartido.EMPATE && this.isResultadosSet();
	}

	finPartido(): void | never {
		if (this.isResultadosSet()){
			let resA: ResultadoPartido, resB: ResultadoPartido;
			if (this.isEquipoAWinner()){
				resA = ResultadoPartido.VICTORIA;
				resB = ResultadoPartido.DERROTA;
			} else if (this.isEmpate()){
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

	setFaltasDescalificadoTorneo(n: number){
		this.faltas_descalificado_torneo = n;
	}

	setFaltasPerderPartido(n: number){
		this.faltas_perder_partido = n;
	}

	private calculaGanador(){

		if (this.golesA > this.golesB){
			this.resultadoGanador = GanadorPartido.GANAA;
		} else if (this.golesA < this.golesB){
			this.resultadoGanador = GanadorPartido.GANAB;
		} else {
			this.resultadoGanador = GanadorPartido.EMPATE;
		}

		let totFaltasA = this.equipoA.getFaltas() + this.faltasA;
		let totFaltasB = this.equipoB.getFaltas() + this.faltasB;

		let isADescalificado = (totFaltasA >= this.faltas_descalificado_torneo) || (this.faltasA >= this.faltas_perder_partido);
		let isBDescalificado = (totFaltasB >= this.faltas_descalificado_torneo) || (this.faltasB >= this.faltas_perder_partido);
		if (isADescalificado && isBDescalificado){
			this.resultadoGanador = GanadorPartido.EMPATE;
		} else if (isADescalificado){
			this.resultadoGanador = GanadorPartido.GANAB;
		} else if (isBDescalificado){
			this.resultadoGanador = GanadorPartido.GANAA;
		}
	}

	private setForcedGanador(ganador: GanadorPartido){
		this.resultadoGanador = ganador;
		this.resultadosWritten = true;
	}
}

enum GanadorPartido{
	GANAA,
	EMPATE,
	GANAB,
}