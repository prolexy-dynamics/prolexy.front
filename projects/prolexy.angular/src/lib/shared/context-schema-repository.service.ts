import { Injectable } from '@angular/core';
import { ContextSchema, ContextSchemaRepository, ExpType } from 'prolexy.core';

@Injectable({
  providedIn: 'root'
})
export class ContextSchemaRepositoryService extends ContextSchemaRepository {
  private _repository: ContextSchemaRepository;
  constructor() {
    super();
    this._repository = new ContextSchemaRepository();
  }
  override getByName(schemaName: string): ExpType {
    return this._repository.getByName(schemaName);
  }
  override register(schemaName: string, type: ExpType) {
    this._repository.register(schemaName, type);
  }
  override getAllRegisteredType(): ContextSchema[]{
    return this._repository.getAllRegisteredType();
  }
}
