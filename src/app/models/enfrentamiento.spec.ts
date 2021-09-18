import { TestBed, waitForAsync } from '@angular/core/testing';
import { DEFAULT_FALTAS_DESCALIFICADO_TORNEO, DEFAULT_FALTAS_PERDER_PARTIDO } from './constants';

import { Enfrentamiento } from './enfrentamiento'
import { Equipo } from './equipo';

function matchAllExcept(eqs: Equipo[], mainIndex: number, exceptIndexes: number[]){ 
	for (let i = 0; i < eqs.length; i++){
		let inExceptIndexes = exceptIndexes.some((e) => {
			return i == e;
		});
		if (i != mainIndex && !inExceptIndexes){
			let enf = new Enfrentamiento(eqs[mainIndex], eqs[i], DEFAULT_FALTAS_DESCALIFICADO_TORNEO, DEFAULT_FALTAS_PERDER_PARTIDO);
			enf.setResultados(0, 0, 0, 0);
			enf.finPartido();
		}
	}
}

describe('Enfrentamiento', () => {

	let eqs: Equipo[];

	const PAIR_NUMBER_OF_EQS = 16;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [Enfrentamiento]
		}).compileComponents();
		eqs = [];
		for( let i = 0; i < PAIR_NUMBER_OF_EQS; i++){
			eqs.push(new Equipo("eq" + i.toString(), DEFAULT_FALTAS_DESCALIFICADO_TORNEO));
		}
	}));

	it('should create', () => {
		let enf = new Enfrentamiento(eqs[0], eqs[1], DEFAULT_FALTAS_DESCALIFICADO_TORNEO, DEFAULT_FALTAS_PERDER_PARTIDO);
		expect(enf).toBeTruthy();
	});

	it('assignate matches all free', () => {
		let enfs = Enfrentamiento.assignateMatches(eqs, DEFAULT_FALTAS_DESCALIFICADO_TORNEO, DEFAULT_FALTAS_PERDER_PARTIDO);
		expect(enfs).toHaveSize(PAIR_NUMBER_OF_EQS/2);
		let cont = 0;
		enfs.forEach((enf) => {
			expect(enf.equipoA.getNombre()).toBe(eqs[cont].getNombre());
			expect(enf.equipoB.getNombre()).toBe(eqs[cont+1].getNombre());
			cont = cont + 2;
		});
	});

	it('assignate matches first can be with second but must be with last', () => {
		matchAllExcept(eqs, 0, [1, PAIR_NUMBER_OF_EQS-1]);
		matchAllExcept(eqs, 1, [0, 2]);
		matchAllExcept(eqs, 2, [1]);
		for (let i = 3; i < PAIR_NUMBER_OF_EQS - 1; i = i+2){
			matchAllExcept(eqs, i, [i+1]);
		}
		let enfs = Enfrentamiento.assignateMatches(eqs, DEFAULT_FALTAS_DESCALIFICADO_TORNEO, DEFAULT_FALTAS_PERDER_PARTIDO);
		expect(enfs).toHaveSize(PAIR_NUMBER_OF_EQS/2);
		expect(enfs[0].equipoA.getNombre()).toBe(eqs[0].getNombre());
		expect(enfs[0].equipoB.getNombre()).toBe(eqs[PAIR_NUMBER_OF_EQS-1].getNombre());
		let cont = 1;
		for (let i = 1; i < enfs.length; i++){
			expect(enfs[i].equipoA.getNombre()).toBe(eqs[cont].getNombre());
			expect(enfs[i].equipoB.getNombre()).toBe(eqs[cont+1].getNombre());
			cont = cont + 2;
		}
	});

	it('asignate matchs impossible', () => {
		expect(PAIR_NUMBER_OF_EQS).toBeGreaterThan(7);
		matchAllExcept(eqs, 7, []);
		let enfs = Enfrentamiento.assignateMatches(eqs, DEFAULT_FALTAS_DESCALIFICADO_TORNEO, DEFAULT_FALTAS_PERDER_PARTIDO);
		expect(enfs).toHaveSize(0);
	});
});
