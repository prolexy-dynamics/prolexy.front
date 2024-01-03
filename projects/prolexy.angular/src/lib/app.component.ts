import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContextSchema, DataSource, Enumerable, Enumeration, Method, MethodSigneture, Property } from 'prolexy.core';
import {  PrimitiveTypes, Token } from 'prolexy.core';
import { ContextSchemaRepositoryService } from './shared/context-schema-repository.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  constructor(private repository: ContextSchemaRepositoryService) { }
  schema: ContextSchema = null!;
  tokens: Array<Token> = []
  contextJson: string = '{}';
  ngOnInit(): void {
    var states = new Enumeration('orderState', [
      { value: 'initiated', text: 'initiated' },
      { value: 'temp', text: 'temp' },
      { value: 'rejected', text: 'rejected' },
      { value: 'confirmed', text: 'confirmed' },
      { value: 'finalized', text: 'finalized' },
    ]);
    // var addressSchema = new ContextSchema(this.repository, "address", [
    //   new Property('provine', 'province', PrimitiveTypes.string, undefined, false, new DataSource('http://localhost:5186/Province', 'id', 'name')),
    //   new Property('city', 'city', PrimitiveTypes.string),
    //   new Property('tell', 'tell', PrimitiveTypes.string),
    // ], []);
    // this.repository.register('orderState', states);
    // this.repository.register('address', addressSchema);
    // this.schema = new ContextSchema(this.repository, "order", [
    //   new Property('provine', 'province', PrimitiveTypes.string, undefined, false, new DataSource('http://localhost:5186/Province', 'id', 'name')),
    //   new Property('product', 'Product', PrimitiveTypes.string),
    //   new Property('state', 'State', PrimitiveTypes.enum, 'orderState'),
    //   new Property('customer', 'Customer', PrimitiveTypes.string),
    //   new Property('price', 'Price', PrimitiveTypes.number),
    //   new Property('discount', 'Discount', PrimitiveTypes.number),
    //   new Property('vip', 'VIP', PrimitiveTypes.bool),
    //   new Property('orderDate', 'Order Date', PrimitiveTypes.datetime),
    //   new Property('productCategory', 'Product Category', PrimitiveTypes.string),
    //   new Property('address', 'Address', new Enumerable(addressSchema)),
    // ], [
    //   new Method("register", "Register", new MethodSigneture(PrimitiveTypes.bool, [PrimitiveTypes.string, PrimitiveTypes.number]))
    // ]);
    this.repository.register('order', this.schema);
    this.tokens = [
    ];
  }
  title = 'art-rule';
  read($event: any) {
    return ($event.target as HTMLElement).textContent!;
  }
}
