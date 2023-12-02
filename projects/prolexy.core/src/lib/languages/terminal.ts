import { ContextSchema, ExpType } from "../models/context-schema";
import { binaryoperations, dateOperations, EOF, KeyWords, logicalOperations, numericOperations, Operations, PrimitiveTypes, relationalOperations, stringOperations, Token, TokenType } from "../models/token";
import { Stack } from "../services/Stack";
import { AccessMember, AnonymousMethod, Assignment, Ast, Binary, Call, ExpectedDeclaration, ExpectedKeywords, ExpectedTokenTypes, IfStatement, ImplicitAccessMember, LiteralPrimitive, Priority, Span, Statements, TypeDetectorContext, TypeDetectorVisitor } from "./ast";

export type Production = (Terminal | NonTerminal);
export class Terminal {
    constructor(public token: { type: TokenType, values?: string[] }) {
    }
    isTerminal(): boolean {
        return true;
    }
}
export class NonTerminal {
    constructor(public name: string) {
    }
    rules: Rule[] = [];
    addRule(rule: Rule) {
        this.rules.push(rule);
    }
    isTerminal(): boolean {
        return false;
    }
}
export class Rule {
    constructor(public productions: Array<Production>) {
    }
}
let nonTerminals = {
    if: new NonTerminal("if"),
    then: new NonTerminal("then"),
    thenPrim: new NonTerminal("then prim"),
    thenZegond: new NonTerminal("then zegond"),
    else: new NonTerminal("else"),
    elsePrim: new NonTerminal("else prim"),
    assignment: new NonTerminal("assignment"),
    assignmentPrim: new NonTerminal("assignment"),
    accessMember: new NonTerminal("access member"),
    accessMemberPrim: new NonTerminal("access member prim"),
    condition: new NonTerminal("cond"),
    logicalOr: new NonTerminal("or"),
    logicalOrPrim: new NonTerminal("or prim"),
    logicalAnd: new NonTerminal("and"),
    logicalAndPrim: new NonTerminal("and prim"),
    relational: new NonTerminal("relational"),
    relationalPrim: new NonTerminal("relational prim"),
    additive: new NonTerminal("add"),
    additivePrim: new NonTerminal("add prim"),
    multiplicative: new NonTerminal("mult"),
    multiplicativePrim: new NonTerminal("mult prim"),
    chain: new NonTerminal("chain"),
    chainPrim: new NonTerminal("chain prim"),
    primary: new NonTerminal("primary"),
    arguments: new NonTerminal("args"),
    argumentsPrim: new NonTerminal("args prim"),
};
nonTerminals.if.addRule(new Rule([
    new Terminal({ type: TokenType.keyword, values: ['if'] }),
    nonTerminals.condition,
    nonTerminals.then,
]));
nonTerminals.then.addRule(new Rule([
    new Terminal({ type: TokenType.keyword, values: ['then'] }),
    nonTerminals.thenPrim,
]));
nonTerminals.thenPrim.addRule(new Rule([
    new Terminal({ type: TokenType.keyword, values: ['set'] }),
    nonTerminals.assignment,
    nonTerminals.thenZegond,
]));
nonTerminals.thenPrim.addRule(new Rule([
    new Terminal({ type: TokenType.keyword, values: ['call'] }),
    nonTerminals.accessMember,
    new Terminal({ type: TokenType.operation, values: [Operations.begin_parentese] }),
    nonTerminals.arguments,
    nonTerminals.thenZegond,
]));
nonTerminals.accessMember.addRule(new Rule([
    new Terminal({ type: TokenType.identifier }),
    nonTerminals.accessMemberPrim,
]));
nonTerminals.accessMemberPrim.addRule(new Rule([
    new Terminal({ type: TokenType.operation, values: [Operations.point] }),
    nonTerminals.accessMember,
]));
nonTerminals.accessMemberPrim.addRule(new Rule([
]));
nonTerminals.thenPrim.addRule(new Rule([
    nonTerminals.if,
    nonTerminals.thenZegond,
]));
nonTerminals.thenZegond.addRule(new Rule([
    new Terminal({ type: TokenType.keyword, values: ['and then'] }),
    nonTerminals.thenPrim,
]));
nonTerminals.thenZegond.addRule(new Rule([
    new Terminal({ type: TokenType.keyword, values: ['end'] })
]));
nonTerminals.thenZegond.addRule(new Rule([
    nonTerminals.else,
]));
nonTerminals.else.addRule(new Rule([
    new Terminal({ type: TokenType.keyword, values: ['else'] }),
    nonTerminals.elsePrim
]));
nonTerminals.elsePrim.addRule(new Rule([
    new Terminal({ type: TokenType.keyword, values: ['if'] }),
    nonTerminals.condition,
    nonTerminals.then,
]));
nonTerminals.elsePrim.addRule(new Rule([
    nonTerminals.thenPrim
]));
nonTerminals.assignment.addRule(new Rule([
    new Terminal({ type: TokenType.identifier }),
    new Terminal({ type: TokenType.keyword, values: ['with'] }),
    nonTerminals.condition,
]));
nonTerminals.assignmentPrim.addRule(new Rule([
    nonTerminals.logicalOr,
]));
nonTerminals.condition.addRule(new Rule([
    nonTerminals.logicalOr,
]));
nonTerminals.logicalOr.addRule(new Rule([
    nonTerminals.logicalAnd,
    nonTerminals.logicalOrPrim,
]));
nonTerminals.logicalOrPrim.addRule(new Rule([
    new Terminal({ type: TokenType.operation, values: [Operations.or] }),
    nonTerminals.logicalOr,
]));
nonTerminals.logicalOrPrim.addRule(new Rule([
]));
nonTerminals.logicalAnd.addRule(new Rule([
    nonTerminals.relational,
    nonTerminals.logicalAndPrim,
]));
nonTerminals.logicalAndPrim.addRule(new Rule([
    new Terminal({ type: TokenType.operation, values: [Operations.and] }),
    nonTerminals.logicalAnd,
]));
nonTerminals.logicalAndPrim.addRule(new Rule([
]));
nonTerminals.relational.addRule(new Rule([
    nonTerminals.additive,
    nonTerminals.relationalPrim,
]));
nonTerminals.relationalPrim.addRule(new Rule([
    new Terminal({
        type: TokenType.operation, values: [
            Operations.eq, Operations.neq, Operations.gt, Operations.gte, Operations.lt, Operations.lte,
            Operations.contains, Operations.notContains, Operations.startsWith, Operations.notStartsWith, Operations.endsWith, Operations.notEndsWith,
        ]
    }),
    nonTerminals.additive,
]));
nonTerminals.relationalPrim.addRule(new Rule([
]));
nonTerminals.additive.addRule(new Rule([
    nonTerminals.multiplicative,
    nonTerminals.additivePrim,
]));
nonTerminals.additivePrim.addRule(new Rule([
    new Terminal({ type: TokenType.operation, values: [Operations.plus, Operations.minus] }),
    nonTerminals.additive,
]));
nonTerminals.additivePrim.addRule(new Rule([
]));
nonTerminals.multiplicative.addRule(new Rule([
    nonTerminals.chain,
    nonTerminals.multiplicativePrim,
]));
nonTerminals.multiplicativePrim.addRule(new Rule([
    new Terminal({ type: TokenType.operation, values: [Operations.multiply, Operations.devide] }),
    nonTerminals.multiplicative,
]));
nonTerminals.multiplicativePrim.addRule(new Rule([
]));
nonTerminals.chain.addRule(new Rule([
    nonTerminals.primary,
    nonTerminals.chainPrim,
]));
nonTerminals.chainPrim.addRule(new Rule([
    new Terminal({ type: TokenType.operation, values: [Operations.point] }),
    new Terminal({ type: TokenType.identifier }),
    nonTerminals.chainPrim,
]));
nonTerminals.chainPrim.addRule(new Rule([
    new Terminal({ type: TokenType.operation, values: [Operations.begin_parentese] }),
    nonTerminals.arguments
]));
nonTerminals.chainPrim.addRule(new Rule([]));
nonTerminals.primary.addRule(new Rule([
    new Terminal({ type: TokenType.identifier })
]));
nonTerminals.primary.addRule(new Rule([
    new Terminal({ type: TokenType.const })
]));
nonTerminals.primary.addRule(new Rule([
    new Terminal({ type: TokenType.operation, values: [Operations.begin_parentese] }),
    nonTerminals.condition,
    new Terminal({ type: TokenType.operation, values: [Operations.end_parentese] }),
]));
nonTerminals.arguments.addRule(new Rule([
    nonTerminals.primary,
    nonTerminals.argumentsPrim,
]));
nonTerminals.arguments.addRule(new Rule([
    new Terminal({ type: TokenType.operation, values: [Operations.end_parentese] })
]));
nonTerminals.argumentsPrim.addRule(new Rule([
    new Terminal({ type: TokenType.operation, values: [Operations.comma] }),
    nonTerminals.arguments,
]));
nonTerminals.argumentsPrim.addRule(new Rule([
    new Terminal({ type: TokenType.operation, values: [Operations.end_parentese] })
]));
nonTerminals.arguments.addRule(new Rule([]));

export function suggestNextTokensInStatementMode(context: ContextSchema, tokens: Array<Token>, to: number) {
    var parser = new Parser(tokens);
    var ast = parser.parseStatements(to);
    var visitor = new TypeDetectorVisitor();
    return populateResult(ast.visit(visitor, new TypeDetectorContext(context, to, undefined, new Stack<Binary>(), new Stack<ExpType>())));
}
export async function suggestNextTokensInExpressionMode(context: ContextSchema, tokens: Array<Token>, to: number): Promise<Array<Token>> {
    var parser = new Parser(tokens);
    var ast = parser.parseExpression(to);
    var visitor = new TypeDetectorVisitor();
    return populateResult(ast.visit(visitor, new TypeDetectorContext(context, to, PrimitiveTypes.bool, new Stack<Binary>(), new Stack<ExpType>())));
}
async function populateResult(res: any): Promise<Array<Token>> {
    if (res.suggestionLoader)
        return await (res.suggestionLoader as Promise<Array<Token>>);
    return res.suggestions;
}
export class Parser {
    constructor(private tokens: Array<Token>) {
        this.tokens = [...tokens];
    }
    private index = 0;
    private spans: Stack<Span> = new Stack<Span>();
    parseStatements(to: number | undefined = undefined): Ast {
        if (to && this.tokens.length > to)
            this.tokens = [...this.tokens.splice(0, to)];
        this.reset();
        this.startSpan();
        var results: Array<Ast> = [];
        do
            results.push(this.parseStatement());
        while (this.consumeOptional(KeyWords.andThen, TokenType.keyword));
        return new Statements(results, this.closeSpan());
    }
    parseExpression(to: number | undefined = undefined): Ast {
        if (to && this.tokens.length > to)
            this.tokens = [...this.tokens.splice(0, to)];
        this.reset();
        return this.parseExp();
    }
    private reset() {
        this.index = 0;

    }
    private peek() {
        return this.tokens[this.index];
    }
    private advance() {
        this.index++;
    }
    startSpan() {
        this.spans.push(new Span(this.index, this.index));
    }
    closeSpan() {
        var span = this.spans.pop()!;
        span.end = this.index;
        return span;
    }

    cloneLastSpan() {
        var span = new Span(this.spans.peek()?.start, this.index);
        return span;
    }

    private parseIf(): Ast {
        var cond = this.parseExp();
        var then = this.parseThen();
        var elseStmnts = this.parseElse();
        return new IfStatement(cond, then, elseStmnts, this.closeSpan());
    }
    parseThen(): Array<Ast> {
        var result = new Array<Ast>();
        if (!this.consumeOptional(KeyWords.then, TokenType.keyword)) {
            return [this.ExpectedKeywords([KeyWords.then])];
        }
        do {
            result.push(this.parseStatement());
        } while (this.consumeOptional(KeyWords.andThen, TokenType.keyword));
        return result;
    }
    parseElse(): Array<Ast> {
        var result = new Array<Ast>();
        if (!this.consumeOptional(KeyWords.else, TokenType.keyword)) return result;
        do {
            result.push(this.parseStatement());
            if (this.consumeOptional(KeyWords.end, TokenType.keyword))
                break;
        } while (this.consumeOptional(KeyWords.andThen, TokenType.keyword));
        return result;
    }
    parseStatement(): Ast {
        this.startSpan();
        var head = this.peek();
        if (head?.tokenType !== TokenType.keyword) return this.ExpectedKeywords([KeyWords.set, KeyWords.call, KeyWords.if]);
        var result;
        switch (head.value) {
            case KeyWords.set:
                this.advance();
                result = this.parseAssignment();
                break;
            case KeyWords.call:
                result = this.parseCallStatement();
                break;
            case KeyWords.if:
                this.advance();
                result = this.parseIf();
                break;
            default:
                return this.ExpectedKeywords([KeyWords.set, KeyWords.call, KeyWords.if]);
        }
        return result;
    }
    parseAssignment(): Ast {
        var left = this.parseChain(), right: Ast = null!;
        if (this.consumeOptional(KeyWords.with, TokenType.keyword))
            right = this.parseExp();
        else {
            right = this.ExpectedKeywords([KeyWords.with]);
        }
        return new Assignment(left, right, this.closeSpan());
    }
    private parseExp() {
        return this.parseLogicalOr();
    }
    private parseLogicalOr(): Ast {
        this.startSpan();
        var result = this.parseLogicalAnd();
        while (this.consumeOptional(Operations.or)) {
            var right = this.parseLogicalAnd();
            result = new Binary(Operations.or, result, right, this.closeSpan());
            this.startSpan();
        }
        this.closeSpan();
        return result;
    }

    private parseLogicalAnd(): Ast {
        this.startSpan()
        var result = this.parseRelational();
        while (this.consumeOptional(Operations.and)) {
            var right = this.parseRelational();
            result = new Binary(Operations.and, result, right, this.closeSpan());
            this.startSpan()
        }
        this.closeSpan();
        return result;
    }

    private parseRelational(): Ast {
        this.startSpan()
        var result = this.parseAdditive();

        var head = this.peek();
        while (head?.tokenType === TokenType.operation) {
            if (relationalOperations.indexOf(head.value as Operations) > -1 ||
                stringOperations.indexOf(head.value as Operations) > -1 ||
                dateOperations.indexOf(head.value as Operations) > -1) {
                this.advance();
                var right = this.parseAdditive();
                result = new Binary(head.value!, result, right, this.closeSpan());
                this.startSpan();
                head = this.peek();
                continue;
            }
            break;
        }
        this.closeSpan();
        return result;
    }

    private parseAdditive(): Ast {
        this.startSpan();
        var result = this.parseMultiplitive();
        var head = this.peek();
        while (head?.tokenType === TokenType.operation) {
            switch (head.value) {
                case Operations.plus:
                case Operations.minus:
                    this.advance();
                    var right = this.parseMultiplitive();
                    result = new Binary(head.value!, result, right, this.closeSpan());
                    head = this.peek();
                    this.startSpan();
                    continue;
            }
            break;
        }
        this.closeSpan();
        return result;
    }

    private parseMultiplitive(): Ast {
        this.startSpan();
        var result = this.parseChain();
        var head = this.peek()
        while (head?.tokenType === TokenType.operation) {
            switch (head.value) {
                case Operations.multiply:
                case Operations.module:
                case Operations.power:
                case Operations.devide:
                    this.advance();
                    var right = this.parseChain();
                    result = new Binary(head.value, result, right, this.closeSpan());
                    head = this.peek();
                    this.startSpan();
                    continue;
            }
            break;
        }
        this.closeSpan();
        return result;
    }

    private parseChain(): Ast {
        this.startSpan();
        var result = this.parsePrimary()!;
        while (true) {
            if (this.consumeOptional(Operations.begin_parentese)) {
                result = this.parseCall(result as AccessMember);
            }
            else if (this.consumeOptional(Operations.point)) {
                result = this.parseAccessMember(result);
            }
            else {
                this.closeSpan();
                break;
            }
        }
        return result;
    }

    private consumeOptional(op: string, tokenType: TokenType = TokenType.operation): Token | undefined {
        var head = this.peek();
        if (head && head.tokenType === tokenType && head.value === op) {
            this.advance();
            return head;
        }
        return;
    }

    private parsePrimary(): Ast {
        this.startSpan();
        if (this.consumeOptional(Operations.begin_parentese)) {
            var result = this.parseExp() as Binary;
            if (!this.consumeOptional(Operations.end_parentese))
                result.expectedAtEnd = this.ExpectedTokenTypes([TokenType.operation], [Operations.end_parentese]);
            return new Priority(result, this.closeSpan());
        }
        var head = this.peek();
        if (head === EOF || !head) {
            this.closeSpan();
            return this.ExpectedTokenTypes([TokenType.const, TokenType.identifier]);
        }
        if (head.tokenType === TokenType.identifier) {
            this.advance();
            return new ImplicitAccessMember(head, this.closeSpan());
        }
        if (head.tokenType === TokenType.const) {
            this.advance();
            return new LiteralPrimitive(head, this.closeSpan());
        }
        if (head.tokenType === TokenType.keyword) {
            switch (head.value) {
                case KeyWords.false:
                case KeyWords.true:
                    this.advance();
                    return new LiteralPrimitive(head, this.closeSpan());
            }
        }
        this.closeSpan();
        return this.ExpectedTokenTypes([TokenType.const, TokenType.identifier]);
    }
    ExpectedTokenTypes(tokenTypes: TokenType[], operators: Operations[] = []): ExpectedTokenTypes {
        this.startSpan();
        //this.advance();
        return new ExpectedTokenTypes(tokenTypes, operators, this.closeSpan());
    }

    private parseCallStatement(): Ast {
        this.advance();
        var left = this.parsePrimary();
        if (!(left instanceof ImplicitAccessMember))
            return this.ExpectedTokenTypes([TokenType.identifier]);
        while (this.consumeOptional(Operations.comma)) {
            left = this.parseAccessMember(left);
        }
        var head = this.peek();
        if (head?.value !== Operations.begin_parentese)
            return this.ExpectedTokenTypes([TokenType.operation], [Operations.begin_parentese]);
        this.advance();
        var args = this.parseArgs();
        if (!this.consumeOptional(Operations.end_parentese)) {
            args.push(this.ExpectedTokenTypes([TokenType.operation], [Operations.end_parentese]));
        }
        return new Call(left as AccessMember, args, this.cloneLastSpan());
    }

    private parseCall(left: AccessMember,): Ast {
        var args = this.parseArgs();
        if (!this.consumeOptional(Operations.end_parentese)) {
            args.push(this.ExpectedTokenTypes([TokenType.operation], [Operations.end_parentese]));
        }
        return new Call(left, args, this.cloneLastSpan());
    }

    private parseAccessMember(left: Ast,): Ast {
        var token = this.peek();
        if (token?.tokenType === TokenType.identifier) {
            this.advance();
            return new AccessMember(left, token, this.cloneLastSpan());
        }
        this.advance();
        return new AccessMember(left, token, this.cloneLastSpan());
    }

    private parseArgs(): Array<Ast> {
        var args = [];
        var head = this.peek();
        while (true) {
            if (!head || head == EOF) {
                args.push(this.ExpectedTokenTypes([TokenType.const, TokenType.identifier, TokenType.keyword]))
                break;
            }
            if (head.tokenType === TokenType.operation && head.value === Operations.end_parentese)
                break;
            if (this.consumeOptional(KeyWords.def, TokenType.keyword))
                args.push(this.parseAnonymousMethod());
            else
                args.push(this.parseExp());
            head = this.peek();
            if (!this.consumeOptional(Operations.comma)) {
                break;
            }
        }

        return args;
    }
    ExpectedKeywords(keywords: KeyWords[]): ExpectedKeywords {
        this.startSpan();
        var head = this.peek();
        this.advance();
        return new ExpectedKeywords(keywords, head, this.closeSpan());
    }
    parseAnonymousMethod(): Ast {
        this.startSpan();
        var head = this.peek();
        if (!head) return new ExpectedDeclaration(this.closeSpan());
        var parameters: Array<Token> = [];
        while (head?.tokenType == TokenType.identifier) {
            parameters.push(head);
            this.advance();
            if (!this.consumeOptional(Operations.point))
                break;
            head = this.peek();
        }

        if (!this.consumeOptional(Operations.arrowFunction))
            return this.ExpectedTokenTypes([TokenType.operation], [Operations.arrowFunction]);
        var body = this.parseExp();
        return new AnonymousMethod(parameters, body, this.closeSpan());
    }
}
