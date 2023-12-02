import { TestBed } from '@angular/core/testing';

import { ContextSchemaRepositoryService } from './context-schema-repository.service';

describe('ContextSchemaRepositoryService', () => {
  let service: ContextSchemaRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContextSchemaRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
