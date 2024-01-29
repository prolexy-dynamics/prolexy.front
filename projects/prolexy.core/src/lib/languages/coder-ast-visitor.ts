import { KeyWords, Operations, PrimitiveTypes } from '../models/token';
import { AccessMember, AnonymousMethod, Assignment, Ast, AstVisitor, Binary, Call, CompositionExpected, Declaration, ExpectedKeywords, ExpectedTokenTypes, IfStatement, ImplicitAccessMember, Instantiation, LiteralPrimitive, Span } from './ast';
export type CodeVisitorResult = {};
var andThen = ' ' + KeyWords.andThen + '\r\n';

export class CoderVisitor implements AstVisitor<CodeVisitorResult> {
    visitInstantiate(ast: Instantiation, context: CodeVisitorResult) {
        var params = ast.parameters.map((p: Ast) => p.visit(this, context)).join(', ') as string;
        return `new ${ast.typeIdentification.value}(${params})`;
    }
    visitCompositExpectations(ast: CompositionExpected, context: CodeVisitorResult) {
        return ''
    }
    visitExpectedDeclaration(declaration: Declaration, context: CodeVisitorResult) {
        return '';
    }
    visit?(ast: Ast, context?: any): string {
        return ast.visit(this, context);
    }
    visitExpectedKeywords(ast: ExpectedKeywords, context: CodeVisitorResult): string {
        return '';
    }
    visitExpectedTokenTypes(ast: ExpectedTokenTypes, context: CodeVisitorResult): string {
        return '';
    }
    visitDeclaration(declaration: Declaration, context: CodeVisitorResult): string {
        return declaration.token.value!;
    }
    visitIfStatement(ifStatement: IfStatement, context: CodeVisitorResult): string {
        var result = `${KeyWords.if} ${ifStatement.condition.visit(this, context)} ${KeyWords.then} 
        ${ifStatement.thenStmts.map(s => s.visit(this, context)).join(andThen)}\r\n`;
        if (ifStatement.elseStmts?.length)
            result += `${KeyWords.else} ${ifStatement.elseStmts.map(s => s.visit(this, context)).join(andThen)}\r\n`;
        result += `${KeyWords.end}\r\n`;
        return result;
    }
    visitAssignment(assignment: Assignment, context: CodeVisitorResult): string {
        return `set ${assignment.left.visit(this, context)} ${KeyWords.with} ${assignment.right.visit(this, context)}\r\n`;
    }
    visitBinary(ast: Binary, context: CodeVisitorResult): string {
        return `${ast.left.visit(this, context)} ${ast.operation} ${ast.right.visit(this, context)}`;
    }
    visitCall(ast: Call, context: CodeVisitorResult): string {
        return `${ast.method.visit(this, context)}(${ast.args.map(a => a.visit(this, context)).join(Operations.comma + ' ')})`;
    }
    visitAnonymousMethod(ast: AnonymousMethod, context: CodeVisitorResult): string {
        return `def ${ast.parameters.map(p => p.value).join(', ')} => ${ast.expression.visit(this, context)}`;
    }
    visitAccessMember(ast: AccessMember, context: CodeVisitorResult): string {
        return ast.left.visit(this, context) + Operations.point + ast.token.value;
    }
    visitImplicitAccessMember(ast: ImplicitAccessMember, context: CodeVisitorResult): string {
        return ast.token.value!;
    }
    visitLiteralPrimitive(ast: LiteralPrimitive, context: CodeVisitorResult): any {
        switch (ast.token.type) {
            case PrimitiveTypes.string: return `'${ast.token.value}'`;
            case PrimitiveTypes.number:
            case PrimitiveTypes.bool:
            case PrimitiveTypes.datetime:
                return `${ast.token.value}`;
        }
    }
    visitAll(statements: Ast[], context: CodeVisitorResult): any {
        return statements.map(ast => ast.visit(this, context)).join(andThen);
    }
    visitPriority(ast: Ast, context: CodeVisitorResult): any {
        return Operations.begin_parentese + ast.visit(this, context) + Operations.end_parentese;
    }
}