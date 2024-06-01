import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContextSchema, IType, PrimitiveTypeData, PrimitiveTypes, Token, TypeCategory, createTypeFromJson } from 'prolexy.core';
import { RouterOutlet } from '@angular/router';
import { ContextSchemaRepositoryService, ExpressionEditorComponent, ProlexyModule, createExpressionValidator } from 'prolexy.angular';
import { ProlexyContext } from 'prolexy.core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // BrowserAnimationsModule,
    // BrowserModule,
    CommonModule,
    FormsModule,
    RouterOutlet,
    ProlexyModule,
    // RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  save() {
    debugger;
  }
  constructor(private repository: ContextSchemaRepositoryService) {
    this.expectedType = PrimitiveTypes.number;
  }
  schema: ContextSchema = null!;
  expectedType: IType;
  tokens: Array<Token> = []
  contextJson: string = '{}';
  expression: FormGroup = null!;
  prolexyContext: ProlexyContext = new ProlexyContext();
  model = { expression: 'Data.EventVersion == 20' };
  ngOnInit(): void {
    var typeData = {
        "businessObjectTypeData": {
            "category": 2,
            "name": "IMakePositionKeepingVoucher",
            "properties": [
                {
                    "propertyName": "OperationCode",
                    "propertyType": {
                        "name": "string",
                        "category": 0
                    }
                },
                {
                    "propertyName": "Data",
                    "propertyType": {
                        "name": "Dynamic",
                        "category": 7
                    }
                },
                {
                    "propertyName": "Amount",
                    "propertyType": {
                        "name": "MoneyData",
                        "category": 6
                    }
                },
                {
                    "propertyName": "BranchCode",
                    "propertyType": {
                        "name": "string",
                        "category": 0
                    }
                },
                {
                    "propertyName": "FcAmount",
                    "propertyType": {
                        "name": "MoneyData",
                        "category": 6
                    }
                },
                {
                    "propertyName": "EqFcAmount",
                    "propertyType": {
                        "name": "MoneyData",
                        "category": 6
                    }
                },
                {
                    "propertyName": "FromBankAccountCode",
                    "propertyType": {
                        "name": "string",
                        "category": 0
                    }
                },
                {
                    "propertyName": "ExchangeRate",
                    "propertyType": {
                        "name": "number",
                        "category": 0
                    }
                },
                {
                    "propertyName": "EqExchangeRate",
                    "propertyType": {
                        "name": "number",
                        "category": 0
                    }
                },
                {
                    "propertyName": "TotalAmount",
                    "propertyType": {
                        "name": "MoneyData",
                        "category": 6
                    }
                }
            ],
            "methods": [],
            "constructors": []
        },
        "extensionMethods": [
            {
                "name": "Eval",
                "contextType": {
                    "name": "void",
                    "category": 0
                },
                "category": 3,
                "parameters": [
                    {
                        "parameterName": "script",
                        "parameterType": {
                            "name": "string",
                            "category": 0
                        }
                    }
                ],
                "returnType": {
                    "name": "Dynamic",
                    "category": 7
                }
            },
            {
                "name": "Iff",
                "contextType": {
                    "name": "void",
                    "category": 0
                },
                "category": 3,
                "parameters": [
                    {
                        "parameterName": "text",
                        "parameterType": {
                            "name": "boolean",
                            "category": 0
                        }
                    },
                    {
                        "parameterName": "trueValue",
                        "parameterType": {
                            "name": "T",
                            "category": 5
                        }
                    },
                    {
                        "parameterName": "falseValue",
                        "parameterType": {
                            "name": "T",
                            "category": 5
                        }
                    }
                ],
                "returnType": {
                    "name": "T",
                    "category": 5
                }
            },
            {
                "name": "SplitBy",
                "contextType": {
                    "name": "string",
                    "category": 0
                },
                "category": 3,
                "parameters": [
                    {
                        "parameterName": "text",
                        "parameterType": {
                            "name": "string",
                            "category": 0
                        }
                    }
                ],
                "returnType":  {
                    "name": "Enumerable",
                    "category": 4,
                    "elementType":{
                        "name": "string",
                        "category": 0
                    }
                }
            },
            {
                "name": "Aggregate",
                "contextType": {
                    "name": "Enumerable<TElement>",
                    "elementType": {
                        "name": "TElement",
                        "category": 5
                    },
                    "category": 4
                },
                "category": 3,
                "parameters": [
                    {
                        "parameterName": "initialState",
                        "parameterType": {
                            "name": "TState",
                            "category": 5
                        }
                    },
                    {
                        "parameterName": "aggregator",
                        "parameterType": {
                            "name": "AnonymousMethod",
                            "contextType": {
                                "name": "void",
                                "category": 0
                            },
                            "category": 3,
                            "parameters": [
                                {
                                    "parameterName": "accumulate",
                                    "parameterType": {
                                        "name": "TState",
                                        "category": 5
                                    }
                                },
                                {
                                    "parameterName": "element",
                                    "parameterType": {
                                        "name": "TElement",
                                        "category": 5
                                    }
                                }
                            ],
                            "returnType": {
                                "name": "TState",
                                "category": 5
                            }
                        }
                    }
                ],
                "returnType": {
                    "name": "TState",
                    "category": 5
                }
            },
            {
                "name": "Avg",
                "contextType": {
                    "name": "Enumerable<TElement>",
                    "elementType": {
                        "name": "TElement",
                        "category": 5
                    },
                    "category": 4
                },
                "category": 3,
                "parameters": [
                    {
                        "parameterName": "selector",
                        "parameterType": {
                            "name": "AnonymousMethod",
                            "contextType": {
                                "name": "void",
                                "category": 0
                            },
                            "category": 3,
                            "parameters": [
                                {
                                    "parameterName": "element",
                                    "parameterType": {
                                        "name": "TElement",
                                        "category": 5
                                    }
                                }
                            ],
                            "returnType": {
                                "name": "number",
                                "category": 0
                            }
                        }
                    }
                ],
                "returnType": {
                    "name": "number",
                    "category": 0
                }
            },
            {
                "name": "Count",
                "contextType": {
                    "name": "Enumerable<TElement>",
                    "elementType": {
                        "name": "TElement",
                        "category": 5
                    },
                    "category": 4
                },
                "category": 3,
                "parameters": [
                    {
                        "parameterName": "predicate",
                        "parameterType": {
                            "name": "AnonymousMethod",
                            "contextType": {
                                "name": "void",
                                "category": 0
                            },
                            "category": 3,
                            "parameters": [
                                {
                                    "parameterName": "element",
                                    "parameterType": {
                                        "name": "TElement",
                                        "category": 5
                                    }
                                }
                            ],
                            "returnType": {
                                "name": "boolean",
                                "category": 0
                            }
                        }
                    }
                ],
                "returnType": {
                    "name": "number",
                    "category": 0
                }
            },
            {
                "name": "Exists",
                "contextType": {
                    "name": "Enumerable<TElement>",
                    "elementType": {
                        "name": "TElement",
                        "category": 5
                    },
                    "category": 4
                },
                "category": 3,
                "parameters": [
                    {
                        "parameterName": "predicate",
                        "parameterType": {
                            "name": "AnonymousMethod",
                            "contextType": {
                                "name": "void",
                                "category": 0
                            },
                            "category": 3,
                            "parameters": [
                                {
                                    "parameterName": "element",
                                    "parameterType": {
                                        "name": "TElement",
                                        "category": 5
                                    }
                                }
                            ],
                            "returnType": {
                                "name": "boolean",
                                "category": 0
                            }
                        }
                    }
                ],
                "returnType": {
                    "name": "boolean",
                    "category": 0
                }
            },
            {
                "name": "First",
                "contextType": {
                    "name": "Enumerable<TElement>",
                    "elementType": {
                        "name": "TElement",
                        "category": 5
                    },
                    "category": 4
                },
                "category": 3,
                "parameters": [],
                "returnType": {
                    "name": "TElement",
                    "category": 5
                }
            },
            {
                "name": "Last",
                "contextType": {
                    "name": "Enumerable<TElement>",
                    "elementType": {
                        "name": "TElement",
                        "category": 5
                    },
                    "category": 4
                },
                "category": 3,
                "parameters": [],
                "returnType": {
                    "name": "TElement",
                    "category": 5
                }
            },
            {
                "name": "Max",
                "contextType": {
                    "name": "Enumerable<TElement>",
                    "elementType": {
                        "name": "TElement",
                        "category": 5
                    },
                    "category": 4
                },
                "category": 3,
                "parameters": [
                    {
                        "parameterName": "selector",
                        "parameterType": {
                            "name": "AnonymousMethod",
                            "contextType": {
                                "name": "void",
                                "category": 0
                            },
                            "category": 3,
                            "parameters": [
                                {
                                    "parameterName": "element",
                                    "parameterType": {
                                        "name": "TElement",
                                        "category": 5
                                    }
                                }
                            ],
                            "returnType": {
                                "name": "number",
                                "category": 0
                            }
                        }
                    }
                ],
                "returnType": {
                    "name": "number",
                    "category": 0
                }
            },
            {
                "name": "Min",
                "contextType": {
                    "name": "Enumerable<TElement>",
                    "elementType": {
                        "name": "TElement",
                        "category": 5
                    },
                    "category": 4
                },
                "category": 3,
                "parameters": [
                    {
                        "parameterName": "selector",
                        "parameterType": {
                            "name": "AnonymousMethod",
                            "contextType": {
                                "name": "void",
                                "category": 0
                            },
                            "category": 3,
                            "parameters": [
                                {
                                    "parameterName": "element",
                                    "parameterType": {
                                        "name": "TElement",
                                        "category": 5
                                    }
                                }
                            ],
                            "returnType": {
                                "name": "number",
                                "category": 0
                            }
                        }
                    }
                ],
                "returnType": {
                    "name": "number",
                    "category": 0
                }
            },
            {
                "name": "Single",
                "contextType": {
                    "name": "Enumerable<TElement>",
                    "elementType": {
                        "name": "TElement",
                        "category": 5
                    },
                    "category": 4
                },
                "category": 3,
                "parameters": [
                    {
                        "parameterName": "predicate",
                        "parameterType": {
                            "name": "AnonymousMethod",
                            "contextType": {
                                "name": "void",
                                "category": 0
                            },
                            "category": 3,
                            "parameters": [
                                {
                                    "parameterName": "element",
                                    "parameterType": {
                                        "name": "TElement",
                                        "category": 5
                                    }
                                }
                            ],
                            "returnType": {
                                "name": "boolean",
                                "category": 0
                            }
                        }
                    }
                ],
                "returnType": {
                    "name": "TElement",
                    "category": 5
                }
            },
            {
                "name": "Sum",
                "contextType": {
                    "name": "Enumerable<TElement>",
                    "elementType": {
                        "name": "TElement",
                        "category": 5
                    },
                    "category": 4
                },
                "category": 3,
                "parameters": [
                    {
                        "parameterName": "selector",
                        "parameterType": {
                            "name": "AnonymousMethod",
                            "contextType": {
                                "name": "void",
                                "category": 0
                            },
                            "category": 3,
                            "parameters": [
                                {
                                    "parameterName": "element",
                                    "parameterType": {
                                        "name": "TElement",
                                        "category": 5
                                    }
                                }
                            ],
                            "returnType": {
                                "name": "number",
                                "category": 0
                            }
                        }
                    }
                ],
                "returnType": {
                    "name": "number",
                    "category": 0
                }
            },
            {
                "name": "AddDays",
                "contextType": {
                    "name": "datetime",
                    "category": 0
                },
                "category": 3,
                "parameters": [
                    {
                        "parameterName": "days",
                        "parameterType": {
                            "name": "number",
                            "category": 0
                        }
                    }
                ],
                "returnType": {
                    "name": "boolean",
                    "category": 0
                }
            },
            {
                "name": "Format",
                "contextType": {
                    "name": "datetime",
                    "category": 0
                },
                "category": 3,
                "parameters": [
                    {
                        "parameterName": "format",
                        "parameterType": {
                            "name": "string",
                            "category": 0
                        }
                    }
                ],
                "returnType": {
                    "name": "boolean",
                    "category": 0
                }
            },
            {
                "name": "Now",
                "contextType": {
                    "name": "datetime",
                    "category": 0
                },
                "category": 3,
                "parameters": [],
                "returnType": {
                    "name": "boolean",
                    "category": 0
                }
            },
            {
                "name": "Print",
                "contextType": {
                    "name": "MoneyData",
                    "category": 6
                },
                "category": 3,
                "parameters": [],
                "returnType": {
                    "name": "string",
                    "category": 0
                }
            }
        ],
        "complexDataTypes": [
            {
                "category": 2,
                "name": "MoneyData",
                "properties": [
                    {
                        "propertyName": "Currency",
                        "propertyType": {
                            "name": "string",
                            "category": 0
                        }
                    },
                    {
                        "propertyName": "Amount",
                        "propertyType": {
                            "name": "number",
                            "category": 0
                        }
                    }
                ],
                "methods": [],
                "constructors": [
                    {
                        "name": "ctor",
                        "contextType": {
                            "name": "void",
                            "category": 0
                        },
                        "category": 3,
                        "parameters": [],
                        "returnType": {
                            "name": "MoneyData",
                            "category": 6
                        }
                    },
                    {
                        "name": "ctor",
                        "contextType": {
                            "name": "void",
                            "category": 0
                        },
                        "category": 3,
                        "parameters": [
                            {
                                "parameterName": "amount",
                                "parameterType": {
                                    "name": "number",
                                    "category": 0
                                }
                            },
                            {
                                "parameterName": "currency",
                                "parameterType": {
                                    "name": "string",
                                    "category": 0
                                }
                            }
                        ],
                        "returnType": {
                            "name": "MoneyData",
                            "category": 6
                        }
                    }
                ]
            },
            {
                "category": 2,
                "name": "IMakePositionKeepingVoucher",
                "properties": [
                    {
                        "propertyName": "OperationCode",
                        "propertyType": {
                            "name": "string",
                            "category": 0
                        }
                    },
                    {
                        "propertyName": "Amount",
                        "propertyType": {
                            "name": "MoneyData",
                            "category": 6
                        }
                    },
                    {
                        "propertyName": "BranchCode",
                        "propertyType": {
                            "name": "string",
                            "category": 0
                        }
                    },
                    {
                        "propertyName": "FcAmount",
                        "propertyType": {
                            "name": "MoneyData",
                            "category": 6
                        }
                    },
                    {
                        "propertyName": "EqFcAmount",
                        "propertyType": {
                            "name": "MoneyData",
                            "category": 6
                        }
                    },
                    {
                        "propertyName": "FromBankAccountCode",
                        "propertyType": {
                            "name": "string",
                            "category": 0
                        }
                    },
                    {
                        "propertyName": "ExchangeRate",
                        "propertyType": {
                            "name": "number",
                            "category": 0
                        }
                    },
                    {
                        "propertyName": "EqExchangeRate",
                        "propertyType": {
                            "name": "number",
                            "category": 0
                        }
                    },
                    {
                        "propertyName": "TotalAmount",
                        "propertyType": {
                            "name": "MoneyData",
                            "category": 6
                        }
                    }
                ],
                "methods": [],
                "constructors": []
            }
        ]
    };
typeData.businessObjectTypeData.properties.push({ "propertyName": "amount", propertyType:{ category: TypeCategory.ReferenceType, name: "MoneyData"}})
    // Object.assign(this.prolexyContext, typeData);
    // var data = createTypeFromJson(this.repository, this.prolexyContext);

    this.schema = typeData as any;//data.businessObjectTypeData.createType(data) as ContextSchema;

    this.expression = new FormGroup({
      firstName: new FormControl('EventVersion == 20', []),
      lastName: new FormControl(''),
    });
    this.tokens = [];
  }
  title = 'art-rule';
  read($event: any) {
    return ($event.target as HTMLElement).textContent!;
  }
  changeReturnType(el: any) {
    debugger;
    this.expectedType = PrimitiveTypes.fromName(el.value)!;
    this.expression.controls['firstName'].updateValueAndValidity();
  }

  show=true;
  toggle(){
    this.show=!this.show;
  }
}


// ExpressionEditorComponent.prototype.ngOnInit = function () {}
