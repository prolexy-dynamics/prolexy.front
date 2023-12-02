import { ContextSchema, Enumeration, ExpType, ExtensionMethod, Method, MethodSigneture, Property } from "../models/context-schema";
import { OperationOrders } from "../models/operation-orders";
import { binaryoperations, dateOperations, IType, KeyWords, logicalOperations, numericOperations, Operations, PrimitiveTypes, relationalOperations, stringOperations, Token, TokenType } from "../models/token";
import { Stack } from "../services/Stack";
import Promise from "ts-promise";

export class Span {
    contains(index: number) {
        return this.start <= index && index <= this.end;
    }
    constructor(public start: number, public end: number) { }
}
export abstract class Ast {
    constructor(public expected: Ast | undefined, public span: Span) { }
    abstract visit<T>(visitor: AstVisitor<T>, context: T): any;
    private _expextecAtEnd?: Ast;
    public set expectedAtEnd(ast: Ast | undefined) {
        this._expextecAtEnd = ast;
    }
    public get expectedAtEnd(): Ast | undefined {
        return this._expextecAtEnd;
    }
}
export class IfStatement extends Ast {
    constructor(public condition: Ast, public thenStmts: Array<Ast>, public elseStmts: Array<Ast>, span: Span) {
        super(new ExpectedKeywords([KeyWords.set, KeyWords.call, KeyWords.if], undefined, span), span);
    }
    visit<T>(visitor: AstVisitor<T>, context: T): any {
        return visitor.visitIfStatement(this, context);
    }
}
export class Assignment extends Ast {
    constructor(public left: Ast, public right: Ast, span: Span) {
        super(new ExpectedKeywords([KeyWords.set, KeyWords.call, KeyWords.if], undefined, span), span);
    }
    visit<T>(visitor: AstVisitor<T>, context: T): any {
        return visitor.visitAssignment(this, context);
    }
}
export class AccessMember extends Ast {
    constructor(public left: Ast, public token: Token, span: Span) {
        super(new ExpectedTokenTypes([TokenType.operation, TokenType.identifier], [Operations.point, Operations.begin_parentese], span), span);
    }
    visit<T>(visitor: AstVisitor<T>, context: T): any {
        return visitor.visitAccessMember(this, context);
    }
}
export class Declaration extends Ast {
    constructor(public token: Token, span: Span) {
        super(new ExpectedTokenTypes([TokenType.identifier], [Operations.point, Operations.begin_parentese], span), span);
    }
    visit<T>(visitor: AstVisitor<T>, context: T): any {
        return visitor.visitDeclaration(this, context);
    }
}
export class Binary extends Ast {
    constructor(public operation: Operations | string, public left: Ast, public right: Ast, span: Span) {
        super(new ExpectedTokenTypes([TokenType.const, TokenType.identifier], [], span), span);
        if (left instanceof Binary)
            (left as Binary)._parent = this;
        if (right instanceof Binary)
            (right as Binary)._parent = this;
    }
    visit<T>(visitor: AstVisitor<T>, context: T): any {
        return visitor.visitBinary(this, context);
    }
    protected _parent?: Binary;
    get parent(): Binary | undefined {
        return this._parent;
    }
    highestPriority: boolean = false;
}
export class ImplicitAccessMember extends Ast {
    constructor(public token: Token, span: Span) {
        super(new ExpectedTokenTypes([TokenType.identifier], [], span), span);
    }
    override visit<T>(visitor: AstVisitor<T>, context: T): any {
        return visitor.visitImplicitAccessMember(this, context);
    }
}
export class LiteralPrimitive extends Ast {
    constructor(public token: Token, span: Span) {
        super(new ExpectedTokenTypes([TokenType.const, TokenType.identifier], [Operations.begin_parentese], span), span);
    }
    visit<T>(visitor: AstVisitor<T>, context: T): any {
        return visitor.visitLiteralPrimitive(this, context);
    }
}
export class ExpectedKeywords extends Ast {
    constructor(public keywords: Array<KeyWords>, public token: Token | undefined, span: Span) {
        super(null!, new Span(span.start, span.start));
    }
    visit<T>(visitor: AstVisitor<T>, context: T): any {
        return visitor.visitExpectedKeywords(this, context);
    }
}
export class ExpectedTokenTypes extends Ast {
    constructor(public tokenTypes: Array<TokenType>, public operators: Operations[], span: Span) {
        super(undefined, new Span(span.start, span.start));
    }
    visit<T>(visitor: AstVisitor<T>, context: T): any {
        return visitor.visitExpectedTokenTypes(this, context);
    }
}
export class ExpectedDeclaration extends Ast {
    constructor(span: Span) {
        super(undefined, new Span(span.start, span.start));
    }
    visit<T>(visitor: AstVisitor<T>, context: T): any {
        return visitor.visitExpectedDeclaration(this, context);
    }
}
export class Call extends Ast {
    constructor(public method: AccessMember, public args: Array<Ast>, span: Span) {
        super(new ExpectedKeywords([KeyWords.set, KeyWords.call, KeyWords.if], undefined, span), span);
    }
    visit<T>(visitor: AstVisitor<T>, context: T): any {
        return visitor.visitCall(this, context);
    }
}
export class AnonymousMethod extends Ast {
    constructor(public parameters: Array<Token>, public expression: Ast, span: Span) {
        super(new ExpectedKeywords([KeyWords.def], undefined, span), span);
    }
    visit<T>(visitor: AstVisitor<T>, context: T): any {
        return visitor.visitAnonymousMethod(this, context);
    }
}
export class Statements extends Ast {
    constructor(public statements: Ast[], span: Span) {
        super(new ExpectedKeywords([KeyWords.set, KeyWords.call, KeyWords.if], undefined, span), span);
    }
    visit<T>(visitor: AstVisitor<T>, context: T) {
        return visitor.visitAll(this.statements, context);
    }
}
export class Priority extends Ast {
    constructor(public ast: Ast, span: Span) {
        super(new ExpectedKeywords([KeyWords.set, KeyWords.call, KeyWords.if], undefined, span), span);
    }
    visit<T>(visitor: AstVisitor<T>, context: T) {
        return visitor.visitPriority(this.ast, context);
    }
}
export interface AstVisitor<T> {
    visitDeclaration(declaration: Declaration, context: T): any;
    visitPriority(ast: Ast, context: T): any;
    visitAll(statements: Ast[], context: T): any;
    visitIfStatement(ifStatement: IfStatement, context: T): any;
    visitAssignment(assignment: Assignment, context: T): any;
    visitAccessMember(ast: AccessMember, context: T): any;
    visitImplicitAccessMember(ast: ImplicitAccessMember, context: T): any;
    visitLiteralPrimitive(ast: LiteralPrimitive, context: T): any;
    visitBinary(ast: Binary, context: T): any;
    visitCall(ast: Call, context: T): any;
    visitAnonymousMethod(ast: AnonymousMethod, context: T): any;
    visitExpectedKeywords(ast: ExpectedKeywords, context: T): any;
    visitExpectedTokenTypes(ast: ExpectedTokenTypes, context: T): any;
    visitExpectedDeclaration(declaration: Ast, context: T): any;

    visit?(ast: Ast, context?: any): any;
}
export class TypeDetectorContext {
    leftType: ExpType = null!;
    lastselectedProperty?: Property;
    constructor(public schema: ContextSchema,
        public typeAt: number,
        public expectedType: ExpType | undefined,
        public binaryAstStack: Stack<Binary>,
        public stackCall: Stack<ExpType>) {
    }
};
type TypeDetectorResult = { type?: ExpType, suggestions: Array<Token>, suggestionLoader?: Promise<Array<Token>>, lastOperandType?: ExpType, lastOperator?: Operations };
export class TypeDetectorVisitor implements AstVisitor<TypeDetectorContext> {
    visitDeclaration(declaration: Declaration, context: TypeDetectorContext) {
        return {};
    }
    visit?(ast: Ast, context?: any) {
        throw new Error("Method not implemented.");
    }
    visitExpectedDeclaration(declaration: Ast, context: TypeDetectorContext) {
        return { suggestions: [new Token(TokenType.identifier, "var", PrimitiveTypes.bool, true)] }
    }
    visitExpectedKeywords(ast: ExpectedKeywords, context: TypeDetectorContext) {
        return { suggestions: ast.keywords.map(k => new Token(TokenType.keyword, k)) }
    }
    getSuggestionFromDataSource(property: Property): Promise<Array<Token>> {
        var ds = property.dataSource!;
        return new Promise(e => {
            var res = fetch(ds.url, { method: 'get' });
            res.then(res => res.json().then(data => {
                var tokens = new Array<Token>();
                for (const item of data) {
                    tokens.push(new Token(TokenType.const, `\${${item[ds.valueSelector]}:${item[ds.textSelector]}:string}`,
                        PrimitiveTypes.selective(property.primitiveType as PrimitiveTypes)))
                }
                e(tokens);
            }))
        });
    }
    visitExpectedTokenTypes(ast: ExpectedTokenTypes, context: TypeDetectorContext) {
        debugger;
        if (!ast.span.contains(context.typeAt))
            return null;
        var result = (ast.tokenTypes.indexOf(TokenType.identifier) > -1)
            ? this.suggestIdentifier(context, undefined, context.expectedType)
            : { suggestions: [] as Array<Token>, suggestionLoader: null as (Promise<Array<Token>> | null)};
        if (ast.tokenTypes.indexOf(TokenType.const) > -1) {
            if (context.expectedType === PrimitiveTypes.number) {
                if (context.lastselectedProperty?.dataSource?.url)
                    result.suggestionLoader = this.getSuggestionFromDataSource(context.lastselectedProperty);
                else
                    result.suggestions.push(new Token(TokenType.const, undefined, PrimitiveTypes.number));
            }
            else if (context.expectedType === PrimitiveTypes.string) {
                if (context.lastselectedProperty?.dataSource?.url)
                    result.suggestionLoader = this.getSuggestionFromDataSource(context.lastselectedProperty);
                else
                    result.suggestions.push(new Token(TokenType.const, undefined, PrimitiveTypes.string));
            }
            else if (context.expectedType === PrimitiveTypes.bool) {
                result.suggestions.push(new Token(TokenType.keyword, "true", PrimitiveTypes.bool));
                result.suggestions.push(new Token(TokenType.keyword, "false", PrimitiveTypes.bool));
            }
            else if (context.expectedType instanceof Enumeration) {
                result.suggestions = [];
                var enums = context.expectedType as Enumeration;
                for (const item of enums.items) {
                    result.suggestions.push(new Token(TokenType.const, `$${item.value}:${item.text}`, PrimitiveTypes.enum));
                }
            }
            else if (context.expectedType === PrimitiveTypes.datetime)
                result.suggestions.push(new Token(TokenType.const, undefined, PrimitiveTypes.datetime));
        }
        if (ast.operators)
            for (var op of ast.operators)
                result.suggestions.push(new Token(TokenType.operation, op))
        return result;
    }
    visitIfStatement(ifStatement: IfStatement, context: TypeDetectorContext): any {
        context.expectedType = PrimitiveTypes.bool;
        if (ifStatement.span.start === context.typeAt)
            return ifStatement.expected?.visit(this, context);
        if (ifStatement.condition.span.contains(context.typeAt)) {
            var result = ifStatement.condition.visit(this, context);
            if (result.type === PrimitiveTypes.bool && ifStatement.condition.span.end === context.typeAt) {
                result.suggestions.splice(0, 0, new Token(TokenType.keyword, KeyWords.then))
            }
            return result;
        }

        var statement = ifStatement.thenStmts.find(a => a.span.contains(context.typeAt));
        if (statement)
            result = statement.visit(this, context);
        if ((!statement && ifStatement.thenStmts[ifStatement.thenStmts.length - 1].span.end === context.typeAt) ||
            (statement?.span.end === context.typeAt))
            result.suggestions = [...result.suggestions,
            new Token(TokenType.keyword, KeyWords.andThen),
            new Token(TokenType.keyword, KeyWords.else),
            new Token(TokenType.keyword, KeyWords.end)];
        if (!statement) {
            statement = ifStatement.elseStmts.find(a => a.span.contains(context.typeAt));
            if (!statement)
                return {
                    suggestions: [new Token(TokenType.keyword, KeyWords.andThen), new Token(TokenType.keyword, KeyWords.end)]
                };
            result = statement.visit(this, context);
            if (statement.span.end === context.typeAt) {
                result.suggestions = [...result.suggestions,
                new Token(TokenType.keyword, KeyWords.andThen),
                new Token(TokenType.keyword, KeyWords.end)];
            }
        }
        return result?.suggestions ? result : {
            suggestions: [new Token(TokenType.keyword, KeyWords.end)]
        };
    }
    visitAssignment(assignment: Assignment, context: TypeDetectorContext): any {
        if (assignment.expected?.span.start === context.typeAt) {
            return assignment.expected?.visit(this, context);
        }
        var result = assignment.left.visit(this, context) as TypeDetectorResult;
        if (assignment.left?.span.start === context.typeAt)
            return result;

        context.expectedType = result.type;

        if (assignment.left?.span.end === context.typeAt) {
            result.suggestions = [];
            if (result.type instanceof ContextSchema) {
                result.suggestions.push(new Token(TokenType.operation, Operations.point));
            }
            result.suggestions.push(new Token(TokenType.keyword, KeyWords.with));
            return result;
        }
        if (assignment.left?.span.contains(context.typeAt)) {
            return result;
        }
        if (assignment.right?.span.contains(context.typeAt))
            result = assignment.right.visit(this, context);
        if (assignment.right?.span.end === context.typeAt) {
            result.suggestions = [...result.suggestions, new Token(TokenType.keyword, KeyWords.andThen)];
        }
        return result;
    }
    visitBinary(ast: Binary, context: TypeDetectorContext): any {
        var result: TypeDetectorResult = { suggestions: [], lastOperator: ast.operation as Operations };
        var leftResult = ast.left.visit(this, context);
        context.leftType = null!;
        if (ast.expectedAtEnd?.span.contains(context.typeAt))
            this.appendExpectedAtEnd(ast, context, result.suggestions);

        if (ast.left?.span.end === context.typeAt) {
            result = this.expectedOperators(ast.left, context);
        }
        else {
            context.binaryAstStack.push(ast);
            if (ast.operation === Operations.is || ast.operation === Operations.isNot)
                context.expectedType = leftResult.type, result.type = PrimitiveTypes.bool;
            else if (numericOperations.find(o => o === ast.operation))
                context.expectedType = PrimitiveTypes.number, result.type = PrimitiveTypes.number;
            else if (dateOperations.find(o => o === ast.operation))
                context.expectedType = PrimitiveTypes.datetime, result.type = PrimitiveTypes.bool;
            else if (stringOperations.find(o => o === ast.operation))
                context.expectedType = PrimitiveTypes.string, result.type = PrimitiveTypes.bool;
            else if (logicalOperations.find(o => o === ast.operation))
                context.expectedType = PrimitiveTypes.bool, result.type = PrimitiveTypes.bool;
            else if (relationalOperations.find(o => o === ast.operation))
                context.expectedType = PrimitiveTypes.number, result.type = PrimitiveTypes.bool;
            if (ast.left?.span.contains(context.typeAt)) {
                context.binaryAstStack.pop();
                return leftResult;
            }
            var right = ast.right?.visit(this, context) as TypeDetectorResult;
            result.lastOperator = right?.lastOperator ?? result.lastOperator;
            result.lastOperandType = right?.lastOperandType;
            context.binaryAstStack.pop();
            var r = { ...result, suggestionLoader: right.suggestionLoader }
            r.suggestions = [...result.suggestions, ...right.suggestions];
            return r;
        }

        return result;
    }
    visitCall(ast: Call, context: TypeDetectorContext): any {
        if (ast.method.span.contains(context.typeAt)) {
            context.expectedType = new MethodSigneture(context.expectedType as PrimitiveTypes, []);
            return ast.method.visit(this, context);
        }
        if (ast.method.span.end == context.typeAt) {
            return { suggestions: [new Token(TokenType.operation, Operations.begin_parentese)] };
        }
        var method = ast.method.visit(this, context) as TypeDetectorResult;
        var argIndex = 0, signature : MethodSigneture | null = null;
        if (method?.type instanceof MethodSigneture) {
            signature = (method.type as MethodSigneture);
        }
        context.leftType = null!;
        for (let i = 0; signature != null && i < signature.parameters.length; i++) {
            var arg = ast.args[i];
            if (arg.span.contains(context.typeAt)) {
                if (arg instanceof AnonymousMethod) {
                    var params = (arg as AnonymousMethod).parameters;
                    var schem = context.schema.create();
                    let idx = 0;
                    for (const p of params) {
                        schem.addProperty(new Property(p.value!, p.value!, (signature.parameters[i] as MethodSigneture).parameters[idx]));
                        idx++;
                    }
                    context.stackCall.push(schem);
                }
                context.expectedType = signature.parameters[argIndex];
                if (arg.span.start !== arg.span.end && arg.span.end === context.typeAt) {
                    var result = arg.visit(this, context);
                    if (!signature || argIndex < signature.parameters.length - 1) result.suggestions.push(new Token(TokenType.operation, Operations.comma));
                    return result;
                }
                return arg.visit(this, context);
            }
            argIndex++;
        }
        if (!context.expectedType)
            return { suggestions: [new Token(TokenType.keyword, KeyWords.andThen)] };
        return this.expectedOperators({ type: signature?.returnType, suggestions: [] }, context);
    }
    visitAnonymousMethod(anonymousMethod: AnonymousMethod, context: TypeDetectorContext): any {
        var method = (context.expectedType as MethodSigneture)
        context.expectedType = method.returnType;
        var result = anonymousMethod.expression.visit(this, context);
        context.stackCall.pop();
        return result;
    }
    visitAccessMember(ast: AccessMember, context: TypeDetectorContext): any {
        var expectedType = context.expectedType;
        context.expectedType = context.schema.create();
        var result = ast.left.visit(this, context) as TypeDetectorResult;
        if (ast.left.span.end == context.typeAt ||
            (ast.span.end === context.typeAt && result?.type instanceof ContextSchema &&
                (result.type as ContextSchema).properties.find(a => a.name === ast.token.value)?.type instanceof ContextSchema)) {
            result.suggestions = [new Token(TokenType.operation, Operations.point)];
            return result;
        }
        if (result.type instanceof ContextSchema)
            context.lastselectedProperty = result.type.properties.find(p => p.name == ast.token?.value);

        if (ast.left.span.contains(context.typeAt))
            return result;
        if (result?.type instanceof ContextSchema || ContextSchema.extensionMethods.find(em => em.methodContext.isAssignableFrom(result?.type))) {
            if (ast.span.end <= context.typeAt) {
                if (result.type instanceof ContextSchema)
                    result.type = (result.type as ContextSchema)!.properties.find(a => a.name === ast.token.value)?.type;
                else {
                    var method = ContextSchema.extensionMethods.find(em => em.methodContext.isAssignableFrom(result.type!) && em.name === ast.token.value);
                    if (method) {
                        var tmp = Object.create(ExtensionMethod.prototype);
                        method = Object.assign(tmp, { caption: method.caption, methodContext: result.type, signeture: method.signeture });
                        result.type = method!.makeGenericMethod();
                        result.suggestions = [new Token(TokenType.operation, Operations.begin_parentese)];
                        return result;
                    }

                    return ast.expected!.visit(this, context);// result.type = new MethodSigneture(PrimitiveTypes.datetime, []);
                }
                return this.expectedOperators(result, context);
            }
            var ctx = result.type as ContextSchema;
            context.leftType = ctx;
            var result = this.suggestIdentifier(context, ast.token, expectedType);
            return result;
        }
        result.suggestions = [];
        return result;
    }
    visitImplicitAccessMember(ast: ImplicitAccessMember, context: TypeDetectorContext): any {
        var result = this.suggestIdentifier(context, ast.token, context.expectedType);
        context.lastselectedProperty = context.schema.properties.find(p => p.name == ast.token?.value);
        context.leftType = result.type!;
        if (result?.type instanceof MethodSigneture && ast.span.end === context.typeAt) {
            result.suggestions = [new Token(TokenType.operation, Operations.begin_parentese)];
            return result;
        }
        if (ast.span.start + Math.floor((ast.span.end - ast.span.start) / 2) === context.typeAt) {
            return result;
        }
        result = { ...result };
        if (result.type instanceof ContextSchema)
            result.suggestions = [new Token(TokenType.operation, Operations.point)];
        else if (context.expectedType)
            result.suggestions = this.expectedOperators(result, context).suggestions;
        if (ast.expectedAtEnd?.span.contains(context.typeAt))
            this.appendExpectedAtEnd(ast, context, result.suggestions);
        if (ContextSchema.extensionMethods.find(em => em.methodContext.isAssignableFrom(result.type!)))
            result.suggestions.push(new Token(TokenType.operation, Operations.point));
        return result;
    }
    private _sug(type: ExpType, expectedType: ExpType | undefined) {
        var result: Array<Token> = [];
        if (type instanceof ContextSchema) {
            var ctx = type as ContextSchema;
            if (expectedType instanceof MethodSigneture) {
                result = [...result, ...ctx.methods.map(m => new Token(TokenType.identifier, `$${m.name}:${m.caption}`))];
            }
            else if (expectedType instanceof ContextSchema) {
                result = [...result, ...ctx.properties
                    .filter(p => p.type instanceof ContextSchema)
                    .map(m => new Token(TokenType.identifier, `$${m.name}:${m.caption}`))];
            }
            else {
                result = [...result, ...ctx.properties
                    .filter(p =>
                        !expectedType ||
                        expectedType === PrimitiveTypes.bool ||
                        p.type === expectedType ||
                        p.type instanceof ContextSchema)
                    .map(m => new Token(TokenType.identifier, `$${m.name}:${m.caption}`))
                    .concat(ctx.methods.filter(p =>
                        !expectedType ||
                        expectedType === PrimitiveTypes.bool ||
                        p.signeture.returnType === expectedType ||
                        ((p.signeture.returnType == expectedType)))
                        .map(m => new Token(TokenType.identifier, `$${m.name}:${m.caption}`)))];
                result.push(new Token(TokenType.operation, Operations.begin_parentese));
            }
        }
        return result;
    }
    private suggestIdentifier(context: TypeDetectorContext, token: Token | undefined, expectedType: ExpType | undefined) {
        var result: TypeDetectorResult = { suggestions: [] };
        var extensionMethods = ContextSchema.extensionMethods
            .filter(et => et.methodContext.isAssignableFrom(context.leftType))
            .map((n) => {
                return new Token(TokenType.identifier, `$${n.name}:${n.caption}`);
            }, new Array<Token>());
        result.suggestions = extensionMethods;
        if (expectedType instanceof MethodSigneture) {
            result.suggestions.push(new Token(TokenType.keyword, KeyWords.def));
        }
        var resolveType = (ctx: ContextSchema) => {
            var prop = ctx.properties.find(p => p.name === token?.value);
            if (prop)
                return prop.type;
            return (ctx.methods.find(m => m.name === token?.value)?.signeture);
        }
        if (context.leftType)
            result.suggestions = [...result.suggestions, ...this._sug(context.leftType, expectedType)]
        else {
            result.suggestions = [...result.suggestions, ...this._sug(context.schema, expectedType)]
            for (const iterator of context.stackCall.iterator()) {
                result.suggestions = [...result.suggestions, ...this._sug(iterator, expectedType)]
                if (iterator instanceof ContextSchema)
                    result.type = resolveType(iterator);
            }
        }
        if (context.schema instanceof ContextSchema && !result.type) {
            result.type = resolveType(context.schema);
        }
        result.lastOperandType = result.type;
        return result;
    }
    appendExpectedAtEnd(ast: Ast, context: any, suggestions: Array<Token>) {
        for (let t of ast.expectedAtEnd?.visit(this, context).suggestions)
            suggestions.push(t);
    }
    visitLiteralPrimitive(ast: LiteralPrimitive, context: TypeDetectorContext): any {
        var result: TypeDetectorResult = { type: (ast.token.tokenType === TokenType.keyword ? PrimitiveTypes.bool : ast.token.type), suggestions: [] };
        if (ast.span.start === context.typeAt) {
            if (context.expectedType === PrimitiveTypes.bool) {
                result.suggestions = [new Token(TokenType.const, "true"), new Token(TokenType.const, "false")]
            } else if (context.expectedType instanceof Enumeration) {
            }
            else {
                result.suggestions = [new Token(TokenType.const, undefined, context.expectedType as PrimitiveTypes)];
            }

            result.suggestions = [...result.suggestions, ...this.suggestIdentifier(context, undefined, context.expectedType).suggestions];
            return result;
        }
        else
            return this.expectedOperators(result, context);
    }
    visitAll(statements: Ast[], context: TypeDetectorContext): any {
        return statements.find(ast => ast.span.contains(context.typeAt))?.visit(this, context);
    }
    visitPriority(ast: Ast, context: TypeDetectorContext): any {
        context.binaryAstStack.clear();
        return ast.visit(this, context);
    }
    private expectedOperators(left: Ast | TypeDetectorResult, context: TypeDetectorContext) {
        var leftExp = left instanceof Ast ? left.visit(this, context) as TypeDetectorResult : left as TypeDetectorResult;
        var last = context.binaryAstStack.peek();
        var result: Token[] = [];
        var blackList: Binary[] = [];
        for (var op of binaryoperations) {
            if ((last?.highestPriority !== true || last.span.contains(context.typeAt)) && (!last || OperationOrders[op] > OperationOrders[last.operation]) &&
                this.compatible(leftExp.type, op)) {
                result.push(Token.operator(op));
                continue;
            }
            var cur: Binary | undefined = last;
            while (cur) {
                if (cur.highestPriority && cur.parent && !cur.span.contains(context.typeAt)) {
                    cur = cur.parent;
                    continue;
                }
                if (cur.operation && OperationOrders[cur.operation] >= OperationOrders[op] &&
                    (!cur.parent || OperationOrders[cur.parent.operation] < OperationOrders[op])) {
                    if (blackList.indexOf(cur) == -1) {
                        if (this.compatible(this.binaryResultType(cur), op)) {
                            result.push(Token.operator(op));
                            break;
                        }
                    }
                }
                cur = cur.parent;
            }
        }
        return { type: leftExp.type, suggestions: result };
    }
    binaryResultType(ast: Binary): PrimitiveTypes {
        if (ast.operation === Operations.is || ast.operation === Operations.isNot ||
            logicalOperations.find(o => o === ast.operation) || relationalOperations.find(o => o === ast.operation) ||
            stringOperations.find(o => o === ast.operation) || dateOperations.find(o => o === ast.operation))
            return PrimitiveTypes.bool;
        return PrimitiveTypes.number;
    }
    compatible(left: ExpType | undefined, right: Operations): boolean {
        if (left === PrimitiveTypes.number)
            return numericOperations.indexOf(right) > -1 || relationalOperations.indexOf(right) > -1;
        if (left === PrimitiveTypes.datetime)
            return [...dateOperations, Operations.is, Operations.isNot].indexOf(right) > -1;
        if (left === PrimitiveTypes.string)
            return [...stringOperations, Operations.is, Operations.isNot].indexOf(right) > -1;
        if (left === PrimitiveTypes.bool)
            return [...logicalOperations, Operations.is, Operations.isNot].indexOf(right) > -1;
        if (left instanceof Enumeration || left === PrimitiveTypes.enum)
            return [Operations.is, Operations.isNot].indexOf(right) > -1;
        return false;
    }
}
