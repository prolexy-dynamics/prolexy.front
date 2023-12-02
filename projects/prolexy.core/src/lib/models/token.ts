export class Token {
    static operator(op: Operations): Token {
        return new Token(TokenType.operation, op);
    }
    constructor(public tokenType: TokenType, value: string | undefined, public type: IType | undefined = undefined, public declaration: boolean = false) {
        this.value = value;
    }
    private _value: string | undefined;
    set value(val: string | undefined) {
        if (this.type === PrimitiveTypes.string && val?.match(/^"[^"]*"/))
            this._value = val.substring(1, val.length - 1);
        else
            this._value = val;
    }
    get value(): string | undefined {
        var c_enum = this._value?.match(/^\$\{(\w*):([\u0600-\u06FF,\w,\s]*):(enum|string|number)\}/);
        if (c_enum) {
            return c_enum[1];
        }
        if (this._value?.startsWith('$') && !this._value.startsWith('$$')) {
            return this._value.substring(1, this._value.indexOf(':'));
        }
        return this._value;
    }
    get text(): string | undefined {
        var c_enum = this._value?.match(/^\$\{(\w*):([\u0600-\u06FF,\w,\s]*):(enum|string|number)\}/);
        if (c_enum) {
            return c_enum[2];
        }
        if (this._value?.startsWith('$') && !this._value.startsWith('$$')) {
            return this._value.substring(this._value.indexOf(':') + 1);
        }
        return (this.tokenType === TokenType.keyword || this.tokenType === TokenType.identifier) ? this._value : (this.type?.name ?? this._value);
    }
    get editable(): boolean {
        return !(this._value?.match(/^\$\{(\w*):([\u0600-\u06FF,\w,\s]*):(enum|string|number)\}/)?.length);

    }
    serialize() {
        var a = this;
        if (this.isComplexConstant()) return '${' + a.value + ':' + a.text + ':' + a.type?.name + '}';
        if (a.tokenType === TokenType.const && a.type === PrimitiveTypes.string) return `"${a.value}"`;
        return a.value;
    }
    isComplexConstant() {
        if (this.tokenType !== TokenType.const) return false;
        if (this.type?.name === PrimitiveTypes.enum.name) return true;
        if (this.type === PrimitiveTypes.string)
            return (this.text !== "string");
        if (this.type === PrimitiveTypes.number) 
            return (this.text !== "number");
        return false;
    }
}
export interface IType {
    isAssignableFrom(type: IType | undefined): unknown;
    get name(): string;
    get genericArguments(): Array<IType>;
    makeGenericType(genericTypes: Array<IType>): IType;
}
export class PrimitiveTypes implements IType {
    constructor(public type: string, public extendedType?: PrimitiveTypes) { }
    get name(): string { return this.type; }
    get genericArguments(): Array<IType> {
        return [];
    }
    makeGenericType(genericTypes: Array<IType>): IType {
        return this;
    }
    isAssignableFrom(type: IType): unknown {
        return this === type;
    }
    static number = new PrimitiveTypes("number");
    static string = new PrimitiveTypes("string");
    static datetime = new PrimitiveTypes("datetime");
    static bool = new PrimitiveTypes("boolean");
    static complex = new PrimitiveTypes("complex");
    static enum = new PrimitiveTypes("enum");
    static selective = (extendedType: PrimitiveTypes) => new PrimitiveTypes("enum", extendedType);
    static null = new PrimitiveTypes("object");
    static all = [this.number, this.string, this.datetime, this.bool, this.complex, this.enum];
    static fromName(name: string) {
        return this.all.find(t => t.name === name);
    }
}

export enum TokenType {
    keyword = 1,
    operation = 2,
    const = 3,
    identifier = 4,
}
export enum KeyWords {
    if = 'if', set = 'set', call = 'call', with = 'with', else = 'else', then = 'then', andThen = 'and then', end = 'end', true = 'true', false = 'false', def = 'def'
}
export const EOF: Token = new Token(TokenType.keyword, "$");


export enum Operations {
    startsWith = 'startsWith',
    endsWith = 'endsWith',
    contains = 'contains',
    notStartsWith = 'notStartsWith',
    notEndsWith = 'notEndsWith',
    notContains = 'notContains',
    empty = 'empty',
    notEmpty = 'notempty',
    after = 'after',
    afterOrEq = 'after or equal to',
    before = 'before',
    beforeOrEq = 'before or equal to',
    plus = '+',
    minus = '-',
    multiply = '*',
    devide = '/',
    module = '%',
    power = '^',
    begin_parentese = '(',
    end_parentese = ')',
    is = 'is',
    isNot = 'is not',
    arrowFunction = "=>",
    eq = '==',
    neq = '!=',
    lte = '<=',
    gte = '>=',
    lt = '<',
    gt = '>',
    or = 'or',
    and = 'and',
    point = '.',
    comma = ',',
}
export let logicalOperations = [Operations.and, Operations.or];
export let relationalOperations = [Operations.is, Operations.isNot, Operations.eq, Operations.neq, Operations.lte, Operations.lt, Operations.gte, Operations.gt];
export let numericOperations = [Operations.plus, Operations.minus, Operations.multiply, Operations.devide, Operations.power];
export let stringOperations = [Operations.contains, Operations.notContains, Operations.startsWith, Operations.notStartsWith, Operations.endsWith, Operations.notEndsWith, Operations.empty, Operations.notEmpty];
export let dateOperations = [Operations.after, Operations.afterOrEq, Operations.before, Operations.beforeOrEq];
export let binaryoperations = [
    ...dateOperations,
    ...logicalOperations,
    ...relationalOperations,
    ...numericOperations,
    ...stringOperations,
];
