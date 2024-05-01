import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContextSchema, IType, PrimitiveTypeData, PrimitiveTypes, Token, createTypeFromJson } from 'prolexy.core';
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
  model = { expression: 'EventVersion == 20' };
  ngOnInit(): void {
    var typeData = {
      "businessObjectTypeData": {
        "category": 2,
        "name": "TradeOrderUpdated",
        "properties": [
          {
            "propertyName": "EventVersion",
            "propertyType": {
              "name": "number",
              "category": 0
            }
          },
          {
            "propertyName": "RequesterUserId",
            "propertyType": {
              "name": "string",
              "category": 0
            }
          },
          {
            "propertyName": "BookingId",
            "propertyType": {
              "name": "string",
              "category": 0
            }
          },
          {
            "propertyName": "CreatorId",
            "propertyType": {
              "name": "string",
              "category": 0
            }
          },
          {
            "propertyName": "BillToTraderId",
            "propertyType": {
              "name": "string",
              "category": 0
            }
          },
          {
            "propertyName": "State",
            "propertyType": {
              "name": "string",
              "category": 0
            }
          },
          {
            "propertyName": "IsOpen",
            "propertyType": {
              "name": "boolean",
              "category": 0
            }
          },
          {
            "propertyName": "ExpirationDate",
            "propertyType": {
              "name": "datetime",
              "category": 0
            }
          },
          {
            "propertyName": "IsExternalRequest",
            "propertyType": {
              "name": "boolean",
              "category": 0
            }
          },
          {
            "propertyName": "Side",
            "propertyType": {
              "name": "string",
              "category": 0
            }
          },
          {
            "propertyName": "OrderNumber",
            "propertyType": {
              "name": "string",
              "category": 0
            }
          },
          {
            "propertyName": "OrderDate",
            "propertyType": {
              "name": "datetime",
              "category": 0
            }
          },
          {
            "propertyName": "Items",
            "propertyType": {
              "name": "Enumerable\u003cTradeOrderItemData\u003e",
              "elementType": {
                "name": "TradeOrderItemData",
                "category": 6
              },
              "category": 4
            }
          },
          {
            "propertyName": "TotalPrice",
            "propertyType": {
              "name": "PriceBreakDownData",
              "category": 6
            }
          },
          {
            "propertyName": "EventId",
            "propertyType": {
              "name": "string",
              "category": 0
            }
          },
          {
            "propertyName": "EventInitiatorId",
            "propertyType": {
              "name": "string",
              "category": 0
            }
          },
          {
            "propertyName": "CorrelationId",
            "propertyType": {
              "name": "string",
              "category": 0
            }
          },
          {
            "propertyName": "CommandId",
            "propertyType": {
              "name": "string",
              "category": 0
            }
          },
          {
            "propertyName": "Id",
            "propertyType": {
              "name": "string",
              "category": 0
            }
          },
          {
            "propertyName": "EventDate",
            "propertyType": {
              "name": "datetime",
              "category": 0
            }
          },
          {
            "propertyName": "Version",
            "propertyType": {
              "name": "number",
              "category": 0
            }
          },
          {
            "propertyName": "OnlyForNotification",
            "propertyType": {
              "name": "boolean",
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
              "name": "TradeOrderUpdated",
              "category": 6
            }
          }
        ]
      },
      "extensionMethods": [
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
          "returnType": {
            "name": "string",
            "category": 0
          }
        },
        {
          "name": "Add",
          "contextType": {
            "name": "Money",
            "category": 6
          },
          "category": 3,
          "parameters": [
            {
              "parameterName": "money",
              "parameterType": {
                "name": "Money",
                "category": 6
              }
            }
          ],
          "returnType": {
            "name": "Money",
            "category": 6
          }
        },
        {
          "name": "Aggregate",
          "contextType": {
            "name": "Enumerable\u003cTElement\u003e",
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
            "name": "Enumerable\u003cTElement\u003e",
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
            "name": "Enumerable\u003cTElement\u003e",
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
            "name": "Enumerable\u003cTElement\u003e",
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
            "name": "Enumerable\u003cTElement\u003e",
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
            "name": "Enumerable\u003cTElement\u003e",
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
            "name": "Enumerable\u003cTElement\u003e",
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
            "name": "Enumerable\u003cTElement\u003e",
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
            "name": "Enumerable\u003cTElement\u003e",
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
            "name": "Enumerable\u003cTElement\u003e",
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
        }
      ],
      "complexDataTypes": [
        {
          "category": 2,
          "name": "CancelData",
          "properties": [
            {
              "propertyName": "Description",
              "propertyType": {
                "name": "string",
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
                "name": "CancelData",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "ReturnItemData",
          "properties": [
            {
              "propertyName": "IssueNumber",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "IssueDate",
              "propertyType": {
                "name": "datetime",
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
                "name": "ReturnItemData",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "ReturnData",
          "properties": [
            {
              "propertyName": "Items",
              "propertyType": {
                "name": "Enumerable\u003cReturnItemData\u003e",
                "elementType": {
                  "name": "ReturnItemData",
                  "category": 6
                },
                "category": 4
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
                "name": "ReturnData",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "MoneyData",
          "properties": [
            {
              "propertyName": "Amount",
              "propertyType": {
                "name": "number",
                "category": 0
              }
            },
            {
              "propertyName": "Currency",
              "propertyType": {
                "name": "string",
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
          "name": "ScaledCurrencyData",
          "properties": [
            {
              "propertyName": "Title",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "AlternateTitle",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Symbol",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "AlternateSymbol",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "ExchangeFactor",
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
                "name": "ScaledCurrencyData",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "ExchangeRate",
          "properties": [
            {
              "propertyName": "TimeStamp",
              "propertyType": {
                "name": "datetime",
                "category": 0
              }
            },
            {
              "propertyName": "FromCurrency",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "ToCurrency",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "ExchangeFactor",
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
              "parameters": [
                {
                  "parameterName": "fromCurrency",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                },
                {
                  "parameterName": "toCurrency",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                },
                {
                  "parameterName": "exchangeFactor",
                  "parameterType": {
                    "name": "number",
                    "category": 0
                  }
                },
                {
                  "parameterName": "timeStamp",
                  "parameterType": {
                    "name": "datetime",
                    "category": 0
                  }
                }
              ],
              "returnType": {
                "name": "ExchangeRate",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "Currency\u0026",
          "properties": [],
          "methods": [],
          "constructors": []
        },
        {
          "category": 2,
          "name": "Currency",
          "properties": [
            {
              "propertyName": "Name",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "AlternateName",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Symbol",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Iso3LetterCode",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "IsoNumericCode",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "AlternateSymbol",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "IsActive",
              "propertyType": {
                "name": "boolean",
                "category": 0
              }
            },
            {
              "propertyName": "IsSystemDefined",
              "propertyType": {
                "name": "boolean",
                "category": 0
              }
            },
            {
              "propertyName": "ScaledCurrencies",
              "propertyType": {
                "name": "Enumerable\u003cScaledCurrencyData\u003e",
                "elementType": {
                  "name": "ScaledCurrencyData",
                  "category": 6
                },
                "category": 4
              }
            },
            {
              "propertyName": "Code1",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Code2",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Code3",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            }
          ],
          "methods": [
            {
              "name": "GetExchangeRate",
              "contextType": {
                "name": "Currency",
                "category": 6
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "exchangeRateSourceId",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                },
                {
                  "parameterName": "to",
                  "parameterType": {
                    "name": "Currency",
                    "category": 6
                  }
                }
              ],
              "returnType": {
                "name": "ExchangeRate",
                "category": 6
              }
            },
            {
              "name": "GetHashCode",
              "contextType": {
                "name": "Currency",
                "category": 6
              },
              "category": 3,
              "parameters": [],
              "returnType": {
                "name": "number",
                "category": 0
              }
            },
            {
              "name": "ToString",
              "contextType": {
                "name": "Currency",
                "category": 6
              },
              "category": 3,
              "parameters": [],
              "returnType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "name": "Equals",
              "contextType": {
                "name": "Currency",
                "category": 6
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "other",
                  "parameterType": {
                    "name": "Currency",
                    "category": 6
                  }
                }
              ],
              "returnType": {
                "name": "boolean",
                "category": 0
              }
            },
            {
              "name": "FromDefaultCulture",
              "contextType": {
                "name": "Currency",
                "category": 6
              },
              "category": 3,
              "parameters": [],
              "returnType": {
                "name": "Currency",
                "category": 6
              }
            },
            {
              "name": "FromIso3LetterCode",
              "contextType": {
                "name": "Currency",
                "category": 6
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "code",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                }
              ],
              "returnType": {
                "name": "Currency",
                "category": 6
              }
            },
            {
              "name": "TryParse",
              "contextType": {
                "name": "Currency",
                "category": 6
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "symbol",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                },
                {
                  "parameterName": "currencyValue",
                  "parameterType": {
                    "name": "Currency\u0026",
                    "category": 6
                  }
                }
              ],
              "returnType": {
                "name": "boolean",
                "category": 0
              }
            }
          ],
          "constructors": [
            {
              "name": "ctor",
              "contextType": {
                "name": "void",
                "category": 0
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "iso3LetterCode",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                }
              ],
              "returnType": {
                "name": "Currency",
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
                  "parameterName": "code",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                },
                {
                  "parameterName": "type",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                }
              ],
              "returnType": {
                "name": "Currency",
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
                  "parameterName": "currencyCode",
                  "parameterType": {
                    "name": "CurrencyCode",
                    "items": [
                      "None",
                      "All",
                      "Dzd",
                      "Ars",
                      "Aud",
                      "Bsd",
                      "Bhd",
                      "Bdt",
                      "Amd",
                      "Bbd",
                      "Bmd",
                      "Bob",
                      "Bwp",
                      "Bzd",
                      "Sbd",
                      "Bnd",
                      "Mmk",
                      "Bif",
                      "Khr",
                      "Cad",
                      "Cve",
                      "Kyd",
                      "Lkr",
                      "Clp",
                      "Cny",
                      "Cop",
                      "Kmf",
                      "Crc",
                      "Hrk",
                      "Cup",
                      "Czk",
                      "Dkk",
                      "Dop",
                      "Svc",
                      "Etb",
                      "Ern",
                      "Eek",
                      "Fkp",
                      "Fjd",
                      "Djf",
                      "Gmd",
                      "Gip",
                      "Gtq",
                      "Gnf",
                      "Gyd",
                      "Htg",
                      "Hnl",
                      "Hkd",
                      "Huf",
                      "Isk",
                      "Inr",
                      "Idr",
                      "IRR",
                      "Iqd",
                      "Ils",
                      "Jmd",
                      "Jpy",
                      "Kzt",
                      "Jod",
                      "Kes",
                      "Kpw",
                      "Krw",
                      "Kwd",
                      "Kgs",
                      "Lak",
                      "Lbp",
                      "Lvl",
                      "Lrd",
                      "Lyd",
                      "Ltl",
                      "Mop",
                      "Mwk",
                      "Myr",
                      "Mvr",
                      "Mro",
                      "Mur",
                      "Mxn",
                      "Mnt",
                      "Mdl",
                      "Mad",
                      "Omr",
                      "Npr",
                      "Ang",
                      "Awg",
                      "Vuv",
                      "Nzd",
                      "Nio",
                      "Ngn",
                      "Nok",
                      "Pkr",
                      "Pab",
                      "Pgk",
                      "Pyg",
                      "Pen",
                      "Php",
                      "Gwp",
                      "Qar",
                      "Rub",
                      "Rwf",
                      "Shp",
                      "Std",
                      "Sar",
                      "Scr",
                      "Sll",
                      "Sgd",
                      "Skk",
                      "Vnd",
                      "Sos",
                      "Zar",
                      "Zwd",
                      "Szl",
                      "Sek",
                      "Chf",
                      "Syp",
                      "Thb",
                      "Top",
                      "Ttd",
                      "Aed",
                      "Tnd",
                      "Tmm",
                      "Ugx",
                      "Mkd",
                      "Egp",
                      "Gbp",
                      "Tzs",
                      "USD",
                      "Uyu",
                      "Uzs",
                      "Wst",
                      "Yer",
                      "Zmk",
                      "Twd",
                      "Ghs",
                      "Vef",
                      "Sdg",
                      "Rsd",
                      "Mzn",
                      "Azn",
                      "Ron",
                      "Try",
                      "Xaf",
                      "Xcd",
                      "Xof",
                      "Xpf",
                      "Xba",
                      "Xbb",
                      "Xbc",
                      "Xbd",
                      "Xau",
                      "Xdr",
                      "Xag",
                      "Xpt",
                      "Xts",
                      "Xpd",
                      "Srd",
                      "Mga",
                      "Afn",
                      "Tjs",
                      "Aoa",
                      "Byr",
                      "Bgn",
                      "Cdf",
                      "Bam",
                      "Eur",
                      "Uah",
                      "Gel",
                      "Pln",
                      "Brl",
                      "Xxx"
                    ],
                    "category": 1
                  }
                }
              ],
              "returnType": {
                "name": "Currency",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "Money\u0026",
          "properties": [],
          "methods": [],
          "constructors": []
        },
        {
          "category": 2,
          "name": "Money",
          "properties": [
            {
              "propertyName": "Currency",
              "propertyType": {
                "name": "Currency",
                "category": 6
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
          "methods": [
            {
              "name": "DeepCopy",
              "contextType": {
                "name": "Money",
                "category": 6
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "source",
                  "parameterType": {
                    "name": "Money",
                    "category": 6
                  }
                }
              ],
              "returnType": {
                "name": "Money",
                "category": 6
              }
            },
            {
              "name": "Clone",
              "contextType": {
                "name": "Money",
                "category": 6
              },
              "category": 3,
              "parameters": [],
              "returnType": {
                "name": "Money",
                "category": 6
              }
            },
            {
              "name": "TryParse",
              "contextType": {
                "name": "Money",
                "category": 6
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "s",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                },
                {
                  "parameterName": "money",
                  "parameterType": {
                    "name": "Money\u0026",
                    "category": 6
                  }
                }
              ],
              "returnType": {
                "name": "boolean",
                "category": 0
              }
            },
            {
              "name": "Round",
              "contextType": {
                "name": "Money",
                "category": 6
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "places",
                  "parameterType": {
                    "name": "RoundingPlaces",
                    "items": [
                      "Zero",
                      "One",
                      "Two",
                      "Three",
                      "Four",
                      "Five",
                      "Six",
                      "Seven",
                      "Eight",
                      "Nine"
                    ],
                    "category": 1
                  }
                },
                {
                  "parameterName": "rounding",
                  "parameterType": {
                    "name": "MidpointRoundingRule",
                    "items": [
                      "ToEven",
                      "AwayFromZero",
                      "TowardZero",
                      "Up",
                      "Down",
                      "Stochastic"
                    ],
                    "category": 1
                  }
                }
              ],
              "returnType": {
                "name": "Money",
                "category": 6
              }
            },
            {
              "name": "Round",
              "contextType": {
                "name": "Money",
                "category": 6
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "places",
                  "parameterType": {
                    "name": "RoundingPlaces",
                    "items": [
                      "Zero",
                      "One",
                      "Two",
                      "Three",
                      "Four",
                      "Five",
                      "Six",
                      "Seven",
                      "Eight",
                      "Nine"
                    ],
                    "category": 1
                  }
                },
                {
                  "parameterName": "rounding",
                  "parameterType": {
                    "name": "MidpointRoundingRule",
                    "items": [
                      "ToEven",
                      "AwayFromZero",
                      "TowardZero",
                      "Up",
                      "Down",
                      "Stochastic"
                    ],
                    "category": 1
                  }
                },
                {
                  "parameterName": "remainder",
                  "parameterType": {
                    "name": "Money\u0026",
                    "category": 6
                  }
                }
              ],
              "returnType": {
                "name": "Money",
                "category": 6
              }
            },
            {
              "name": "GetHashCode",
              "contextType": {
                "name": "Money",
                "category": 6
              },
              "category": 3,
              "parameters": [],
              "returnType": {
                "name": "number",
                "category": 0
              }
            },
            {
              "name": "ToString",
              "contextType": {
                "name": "Money",
                "category": 6
              },
              "category": 3,
              "parameters": [],
              "returnType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "name": "ToString",
              "contextType": {
                "name": "Money",
                "category": 6
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
                "name": "string",
                "category": 0
              }
            },
            {
              "name": "SameValueAs",
              "contextType": {
                "name": "Money",
                "category": 6
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "other",
                  "parameterType": {
                    "name": "Money",
                    "category": 6
                  }
                }
              ],
              "returnType": {
                "name": "boolean",
                "category": 0
              }
            },
            {
              "name": "CompareTo",
              "contextType": {
                "name": "Money",
                "category": 6
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "other",
                  "parameterType": {
                    "name": "Money",
                    "category": 6
                  }
                }
              ],
              "returnType": {
                "name": "number",
                "category": 0
              }
            },
            {
              "name": "ToScaled",
              "contextType": {
                "name": "Money",
                "category": 6
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "scaledSymbol",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                }
              ],
              "returnType": {
                "name": "number",
                "category": 0
              }
            }
          ],
          "constructors": [
            {
              "name": "ctor",
              "contextType": {
                "name": "void",
                "category": 0
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "value",
                  "parameterType": {
                    "name": "number",
                    "category": 0
                  }
                }
              ],
              "returnType": {
                "name": "Money",
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
                  "parameterName": "value",
                  "parameterType": {
                    "name": "number",
                    "category": 0
                  }
                },
                {
                  "parameterName": "currency",
                  "parameterType": {
                    "name": "Currency",
                    "category": 6
                  }
                },
                {
                  "parameterName": "scaledSymbol",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                }
              ],
              "returnType": {
                "name": "Money",
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
                  "parameterName": "value",
                  "parameterType": {
                    "name": "number",
                    "category": 0
                  }
                },
                {
                  "parameterName": "currencyCode",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                }
              ],
              "returnType": {
                "name": "Money",
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
                  "parameterName": "value",
                  "parameterType": {
                    "name": "number",
                    "category": 0
                  }
                },
                {
                  "parameterName": "currency",
                  "parameterType": {
                    "name": "Currency",
                    "category": 6
                  }
                }
              ],
              "returnType": {
                "name": "Money",
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
                  "parameterName": "units",
                  "parameterType": {
                    "name": "number",
                    "category": 0
                  }
                },
                {
                  "parameterName": "fraction",
                  "parameterType": {
                    "name": "number",
                    "category": 0
                  }
                },
                {
                  "parameterName": "currency",
                  "parameterType": {
                    "name": "Currency",
                    "category": 6
                  }
                }
              ],
              "returnType": {
                "name": "Money",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "Discount",
          "properties": [
            {
              "propertyName": "Code",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Description",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "IsAccumulative",
              "propertyType": {
                "name": "boolean",
                "category": 0
              }
            },
            {
              "propertyName": "Value",
              "propertyType": {
                "name": "Money",
                "category": 6
              }
            }
          ],
          "methods": [
            {
              "name": "ToData",
              "contextType": {
                "name": "Discount",
                "category": 6
              },
              "category": 3,
              "parameters": [],
              "returnType": {
                "name": "DiscountData",
                "category": 6
              }
            },
            {
              "name": "SameValueAs",
              "contextType": {
                "name": "Discount",
                "category": 6
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "other",
                  "parameterType": {
                    "name": "Discount",
                    "category": 6
                  }
                }
              ],
              "returnType": {
                "name": "boolean",
                "category": 0
              }
            },
            {
              "name": "GetHashCode",
              "contextType": {
                "name": "Discount",
                "category": 6
              },
              "category": 3,
              "parameters": [],
              "returnType": {
                "name": "number",
                "category": 0
              }
            }
          ],
          "constructors": [
            {
              "name": "ctor",
              "contextType": {
                "name": "void",
                "category": 0
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "value",
                  "parameterType": {
                    "name": "Money",
                    "category": 6
                  }
                },
                {
                  "parameterName": "code",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                },
                {
                  "parameterName": "isAccumulative",
                  "parameterType": {
                    "name": "boolean",
                    "category": 0
                  }
                },
                {
                  "parameterName": "description",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                }
              ],
              "returnType": {
                "name": "Discount",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "DiscountData",
          "properties": [
            {
              "propertyName": "Code",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Description",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "IsAccumulative",
              "propertyType": {
                "name": "boolean",
                "category": 0
              }
            },
            {
              "propertyName": "Value",
              "propertyType": {
                "name": "MoneyData",
                "category": 6
              }
            }
          ],
          "methods": [
            {
              "name": "ToModel",
              "contextType": {
                "name": "DiscountData",
                "category": 6
              },
              "category": 3,
              "parameters": [],
              "returnType": {
                "name": "Discount",
                "category": 6
              }
            }
          ],
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
                "name": "DiscountData",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "Tax",
          "properties": [
            {
              "propertyName": "Code",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Description",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Value",
              "propertyType": {
                "name": "Money",
                "category": 6
              }
            }
          ],
          "methods": [
            {
              "name": "ToData",
              "contextType": {
                "name": "Tax",
                "category": 6
              },
              "category": 3,
              "parameters": [],
              "returnType": {
                "name": "TaxData",
                "category": 6
              }
            },
            {
              "name": "SameValueAs",
              "contextType": {
                "name": "Tax",
                "category": 6
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "other",
                  "parameterType": {
                    "name": "Tax",
                    "category": 6
                  }
                }
              ],
              "returnType": {
                "name": "boolean",
                "category": 0
              }
            },
            {
              "name": "GetHashCode",
              "contextType": {
                "name": "Tax",
                "category": 6
              },
              "category": 3,
              "parameters": [],
              "returnType": {
                "name": "number",
                "category": 0
              }
            }
          ],
          "constructors": [
            {
              "name": "ctor",
              "contextType": {
                "name": "void",
                "category": 0
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "value",
                  "parameterType": {
                    "name": "Money",
                    "category": 6
                  }
                },
                {
                  "parameterName": "code",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                },
                {
                  "parameterName": "description",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                }
              ],
              "returnType": {
                "name": "Tax",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "TaxData",
          "properties": [
            {
              "propertyName": "Code",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Description",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Value",
              "propertyType": {
                "name": "MoneyData",
                "category": 6
              }
            }
          ],
          "methods": [
            {
              "name": "ToModel",
              "contextType": {
                "name": "TaxData",
                "category": 6
              },
              "category": 3,
              "parameters": [],
              "returnType": {
                "name": "Tax",
                "category": 6
              }
            }
          ],
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
                "name": "TaxData",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "PriceBreakDown",
          "properties": [
            {
              "propertyName": "Discounts",
              "propertyType": {
                "name": "Enumerable\u003cDiscount\u003e",
                "elementType": {
                  "name": "Discount",
                  "category": 6
                },
                "category": 4
              }
            },
            {
              "propertyName": "Taxes",
              "propertyType": {
                "name": "Enumerable\u003cTax\u003e",
                "elementType": {
                  "name": "Tax",
                  "category": 6
                },
                "category": 4
              }
            },
            {
              "propertyName": "BasePrice",
              "propertyType": {
                "name": "Money",
                "category": 6
              }
            },
            {
              "propertyName": "Price",
              "propertyType": {
                "name": "Money",
                "category": 6
              }
            },
            {
              "propertyName": "UnitPrice",
              "propertyType": {
                "name": "Money",
                "category": 6
              }
            },
            {
              "propertyName": "UnitGrossPrice",
              "propertyType": {
                "name": "Money",
                "category": 6
              }
            },
            {
              "propertyName": "GrossPrice",
              "propertyType": {
                "name": "Money",
                "category": 6
              }
            }
          ],
          "methods": [
            {
              "name": "ToData",
              "contextType": {
                "name": "PriceBreakDown",
                "category": 6
              },
              "category": 3,
              "parameters": [],
              "returnType": {
                "name": "PriceBreakDownData",
                "category": 6
              }
            },
            {
              "name": "SameValueAs",
              "contextType": {
                "name": "PriceBreakDown",
                "category": 6
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "other",
                  "parameterType": {
                    "name": "PriceBreakDown",
                    "category": 6
                  }
                }
              ],
              "returnType": {
                "name": "boolean",
                "category": 0
              }
            },
            {
              "name": "GetHashCode",
              "contextType": {
                "name": "PriceBreakDown",
                "category": 6
              },
              "category": 3,
              "parameters": [],
              "returnType": {
                "name": "number",
                "category": 0
              }
            }
          ],
          "constructors": [
            {
              "name": "ctor",
              "contextType": {
                "name": "void",
                "category": 0
              },
              "category": 3,
              "parameters": [
                {
                  "parameterName": "basePrice",
                  "parameterType": {
                    "name": "Money",
                    "category": 6
                  }
                },
                {
                  "parameterName": "price",
                  "parameterType": {
                    "name": "Money",
                    "category": 6
                  }
                },
                {
                  "parameterName": "unitPrice",
                  "parameterType": {
                    "name": "Money",
                    "category": 6
                  }
                },
                {
                  "parameterName": "grossPrice",
                  "parameterType": {
                    "name": "Money",
                    "category": 6
                  }
                },
                {
                  "parameterName": "unitGrossPrice",
                  "parameterType": {
                    "name": "Money",
                    "category": 6
                  }
                },
                {
                  "parameterName": "discounts",
                  "parameterType": {
                    "name": "Enumerable\u003cDiscount\u003e",
                    "elementType": {
                      "name": "Discount",
                      "category": 6
                    },
                    "category": 4
                  }
                },
                {
                  "parameterName": "taxes",
                  "parameterType": {
                    "name": "Enumerable\u003cTax\u003e",
                    "elementType": {
                      "name": "Tax",
                      "category": 6
                    },
                    "category": 4
                  }
                }
              ],
              "returnType": {
                "name": "PriceBreakDown",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "PriceBreakDownData",
          "properties": [
            {
              "propertyName": "Discounts",
              "propertyType": {
                "name": "Enumerable\u003cDiscountData\u003e",
                "elementType": {
                  "name": "DiscountData",
                  "category": 6
                },
                "category": 4
              }
            },
            {
              "propertyName": "Taxes",
              "propertyType": {
                "name": "Enumerable\u003cTaxData\u003e",
                "elementType": {
                  "name": "TaxData",
                  "category": 6
                },
                "category": 4
              }
            },
            {
              "propertyName": "BasePrice",
              "propertyType": {
                "name": "MoneyData",
                "category": 6
              }
            },
            {
              "propertyName": "Price",
              "propertyType": {
                "name": "MoneyData",
                "category": 6
              }
            },
            {
              "propertyName": "UnitPrice",
              "propertyType": {
                "name": "MoneyData",
                "category": 6
              }
            },
            {
              "propertyName": "UnitGrossPrice",
              "propertyType": {
                "name": "MoneyData",
                "category": 6
              }
            },
            {
              "propertyName": "GrossPrice",
              "propertyType": {
                "name": "MoneyData",
                "category": 6
              }
            }
          ],
          "methods": [
            {
              "name": "ToModel",
              "contextType": {
                "name": "PriceBreakDownData",
                "category": 6
              },
              "category": 3,
              "parameters": [],
              "returnType": {
                "name": "PriceBreakDown",
                "category": 6
              }
            }
          ],
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
                "name": "PriceBreakDownData",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "QuantityData",
          "properties": [
            {
              "propertyName": "UnitOfMeasure",
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
                "name": "QuantityData",
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
                  "parameterName": "unitOfMeasure",
                  "parameterType": {
                    "name": "string",
                    "category": 0
                  }
                }
              ],
              "returnType": {
                "name": "QuantityData",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "IssueItemData",
          "properties": [
            {
              "propertyName": "ProductId",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "TraderId",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Price",
              "propertyType": {
                "name": "PriceBreakDownData",
                "category": 6
              }
            },
            {
              "propertyName": "IssueNumber",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Quantity",
              "propertyType": {
                "name": "QuantityData",
                "category": 6
              }
            },
            {
              "propertyName": "RemainingQuantity",
              "propertyType": {
                "name": "QuantityData",
                "category": 6
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
                "name": "IssueItemData",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "IssueData",
          "properties": [
            {
              "propertyName": "Items",
              "propertyType": {
                "name": "Enumerable\u003cIssueItemData\u003e",
                "elementType": {
                  "name": "IssueItemData",
                  "category": 6
                },
                "category": 4
              }
            },
            {
              "propertyName": "IssueDate",
              "propertyType": {
                "name": "datetime",
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
                "name": "IssueData",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "DeliveryItemData",
          "properties": [
            {
              "propertyName": "IssueTime",
              "propertyType": {
                "name": "datetime",
                "category": 0
              }
            },
            {
              "propertyName": "BookingNumber",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "IssueNumber",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Price",
              "propertyType": {
                "name": "MoneyData",
                "category": 6
              }
            },
            {
              "propertyName": "Quantity",
              "propertyType": {
                "name": "QuantityData",
                "category": 6
              }
            },
            {
              "propertyName": "OldQuantity",
              "propertyType": {
                "name": "QuantityData",
                "category": 6
              }
            },
            {
              "propertyName": "ShipToTraderId",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "MarkedForReturn",
              "propertyType": {
                "name": "boolean",
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
                "name": "DeliveryItemData",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "PaymentOrderData",
          "properties": [
            {
              "propertyName": "Code",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Value",
              "propertyType": {
                "name": "MoneyData",
                "category": 6
              }
            },
            {
              "propertyName": "AccountCode",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "IsSettled",
              "propertyType": {
                "name": "boolean",
                "category": 0
              }
            },
            {
              "propertyName": "TransactionData",
              "propertyType": {
                "name": "string",
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
                "name": "PaymentOrderData",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "TradeOrderItemData",
          "properties": [
            {
              "propertyName": "Id",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "BookingVersion",
              "propertyType": {
                "name": "number",
                "category": 0
              }
            },
            {
              "propertyName": "BookingData",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "IssueData",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "RequestedCancelData",
              "propertyType": {
                "name": "CancelData",
                "category": 6
              }
            },
            {
              "propertyName": "RequestedReturnData",
              "propertyType": {
                "name": "ReturnData",
                "category": 6
              }
            },
            {
              "propertyName": "RequestedIssueData",
              "propertyType": {
                "name": "IssueData",
                "category": 6
              }
            },
            {
              "propertyName": "IsDeleted",
              "propertyType": {
                "name": "boolean",
                "category": 0
              }
            },
            {
              "propertyName": "StateCode",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "OperationsHistory",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Product",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Catalog",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Price",
              "propertyType": {
                "name": "PriceBreakDownData",
                "category": 6
              }
            },
            {
              "propertyName": "Quantity",
              "propertyType": {
                "name": "QuantityData",
                "category": 6
              }
            },
            {
              "propertyName": "MinQuantity",
              "propertyType": {
                "name": "QuantityData",
                "category": 6
              }
            },
            {
              "propertyName": "DiscloseQuantity",
              "propertyType": {
                "name": "QuantityData",
                "category": 6
              }
            },
            {
              "propertyName": "Validity",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "ValidityDate",
              "propertyType": {
                "name": "datetime",
                "category": 0
              }
            },
            {
              "propertyName": "DeliveryItems",
              "propertyType": {
                "name": "Enumerable\u003cDeliveryItemData\u003e",
                "elementType": {
                  "name": "DeliveryItemData",
                  "category": 6
                },
                "category": 4
              }
            },
            {
              "propertyName": "RequestedBookings",
              "propertyType": {
                "name": "Enumerable\u003cstring\u003e",
                "elementType": {
                  "name": "string",
                  "category": 0
                },
                "category": 4
              }
            },
            {
              "propertyName": "PaymentOrders",
              "propertyType": {
                "name": "Enumerable\u003cPaymentOrderData\u003e",
                "elementType": {
                  "name": "PaymentOrderData",
                  "category": 6
                },
                "category": 4
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
                "name": "TradeOrderItemData",
                "category": 6
              }
            }
          ]
        },
        {
          "category": 2,
          "name": "TradeOrderUpdated",
          "properties": [
            {
              "propertyName": "EventVersion",
              "propertyType": {
                "name": "number",
                "category": 0
              }
            },
            {
              "propertyName": "RequesterUserId",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "BookingId",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "CreatorId",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "BillToTraderId",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "State",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "IsOpen",
              "propertyType": {
                "name": "boolean",
                "category": 0
              }
            },
            {
              "propertyName": "ExpirationDate",
              "propertyType": {
                "name": "datetime",
                "category": 0
              }
            },
            {
              "propertyName": "IsExternalRequest",
              "propertyType": {
                "name": "boolean",
                "category": 0
              }
            },
            {
              "propertyName": "Side",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "OrderNumber",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "OrderDate",
              "propertyType": {
                "name": "datetime",
                "category": 0
              }
            },
            {
              "propertyName": "Items",
              "propertyType": {
                "name": "Enumerable\u003cTradeOrderItemData\u003e",
                "elementType": {
                  "name": "TradeOrderItemData",
                  "category": 6
                },
                "category": 4
              }
            },
            {
              "propertyName": "TotalPrice",
              "propertyType": {
                "name": "PriceBreakDownData",
                "category": 6
              }
            },
            {
              "propertyName": "EventId",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "EventInitiatorId",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "CorrelationId",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "CommandId",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "Id",
              "propertyType": {
                "name": "string",
                "category": 0
              }
            },
            {
              "propertyName": "EventDate",
              "propertyType": {
                "name": "datetime",
                "category": 0
              }
            },
            {
              "propertyName": "Version",
              "propertyType": {
                "name": "number",
                "category": 0
              }
            },
            {
              "propertyName": "OnlyForNotification",
              "propertyType": {
                "name": "boolean",
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
                "name": "TradeOrderUpdated",
                "category": 6
              }
            }
          ]
        }
      ]
    };

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
