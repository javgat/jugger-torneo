import { TestBed, waitForAsync } from '@angular/core/testing';
import { DEFAULT_FALTAS_DESCALIFICADO_TORNEO, DEFAULT_FALTAS_PERDER_PARTIDO } from './constants';

import { Enfrentamiento } from './enfrentamiento'
import { Equipo } from './equipo';

describe('Enfrentamiento', () => {

	let eqA: Equipo, eqB: Equipo;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [Enfrentamiento]
		}).compileComponents();
		eqA = new Equipo("eqA", DEFAULT_FALTAS_DESCALIFICADO_TORNEO);
		eqB = new Equipo("eqB", DEFAULT_FALTAS_DESCALIFICADO_TORNEO);
	}));

	it('should create', () => {
		let enf = new Enfrentamiento(eqA, eqB, DEFAULT_FALTAS_DESCALIFICADO_TORNEO, DEFAULT_FALTAS_PERDER_PARTIDO);
		expect(enf).toBeTruthy();
	});
});
