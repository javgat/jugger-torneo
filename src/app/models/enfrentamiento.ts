import { FALTAS_DESCALIFICADO_TORNEO, FALTAS_PERDER_PARTIDO } from "./constants";
import { Equipo, ResultadoPartido } from "./equipo";

export class Enfrentamiento{
	equipoA: Equipo;
	equipoB: Equipo;

	golesA: number;
	faltasA: number;

	golesB: number;
	faltasB: number;

	resultadoGanador: GanadorPartido;

	private resultadosWritten: boolean

	constructor(equipoA: Equipo, equipoB: Equipo){
		this.equipoA = equipoA;
		this.equipoB = equipoB;
		
		this.golesA = 0;
		this.faltasA = 0;
		this.golesB = 0;
		this.faltasB = 0;
		this.resultadoGanador = GanadorPartido.EMPATE;
		this.resultadosWritten = false;
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
		} else {
			throw new Error("Resultado of Entrenamiento is not set yet");
		}
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

		let isADescalificado = (totFaltasA >= FALTAS_DESCALIFICADO_TORNEO) || (this.faltasA >= FALTAS_PERDER_PARTIDO);
		let isBDescalificado = (totFaltasB >= FALTAS_DESCALIFICADO_TORNEO) || (this.faltasB >= FALTAS_PERDER_PARTIDO);
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