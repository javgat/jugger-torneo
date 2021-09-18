import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';

import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Storage],
    }).compileComponents();
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
