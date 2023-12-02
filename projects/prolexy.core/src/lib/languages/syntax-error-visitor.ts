import { ContextSchema, ExpType } from '../models/context-schema';
import { KeyWords, PrimitiveTypes, Token, TokenType } from '../models/token';
import { AccessMember, AnonymousMethod, Assignment, Ast, AstVisitor, Binary, Call, Declaration, ExpectedKeywords, ExpectedTokenTypes, IfStatement, ImplicitAccessMember, LiteralPrimitive, Span } from './ast';
export type SyntaxErrorContext = { errors: Array<{ span: Span, message: string }> };

export class SyntaxErrorVisitor implements AstVisitor<SyntaxErrorContext> {
    visitExpectedDeclaration(declaration: Declaration, context: SyntaxErrorContext) {
        context.errors.push({ span: declaration.span, message: "unexpected token: you must provide identifier to declare new variable or parameter." });
    }
    visit?(ast: Ast, context?: any): any {
        return ast.visit(this, context);
    }
    visitExpectedKeywords(ast: ExpectedKeywords, context: SyntaxErrorContext) {
        context.errors.push({ span: ast.span, message: 'Unexpected token: ' });
    }
    visitExpectedTokenTypes(ast: ExpectedTokenTypes, context: SyntaxErrorContext) {
        context.errors.push({ span: ast.span, message: 'Unexpected token: ' });
    }
    visitDeclaration(declaration: Declaration, context: SyntaxErrorContext) {
        if (!declaration.token.value?.match(/w(w|d)*/)?.length)
            context.errors.push({ span: declaration.span, message: "Declaration exception, only alpha numeric character can be use in declaration." });
    }
    visitIfStatement(ifStatement: IfStatement, context: SyntaxErrorContext): any {
        ifStatement.condition.visit(this, context);

        for (const st of ifStatement.thenStmts) {
            st.visit(this, context);
        }
        for (const st of ifStatement.elseStmts) {
            st.visit(this, context);
        }
    }
    visitAssignment(assignment: Assignment, context: SyntaxErrorContext): any {
        assignment.left.visit(this, context);
        assignment.right.visit(this, context);
    }
    visitBinary(ast: Binary, context: SyntaxErrorContext): any {
        ast.left.visit(this, context);
        ast.right.visit(this, context);
    }
    visitCall(ast: Call, context: SyntaxErrorContext): any {
        ast.method.visit(this, context);
        for (let arg of ast.args) {
            arg.visit(this, context);
        }
    }
    visitAnonymousMethod(ast: AnonymousMethod, context: SyntaxErrorContext) {

    }
    visitAccessMember(ast: AccessMember, context: SyntaxErrorContext): any {
        ast.left.visit(this, context);
    }
    visitImplicitAccessMember(ast: ImplicitAccessMember, context: SyntaxErrorContext): any {
    }
    appendExpectedAtEnd(ast: Ast, context: any, suggestions: Array<Token>) {
        for (let t of ast.expectedAtEnd?.visit(this, context).suggestions)
            suggestions.push(t);
    }
    visitLiteralPrimitive(ast: LiteralPrimitive, context: SyntaxErrorContext): any {
    }
    visitAll(statements: Ast[], context: SyntaxErrorContext): any {
        statements.forEach(ast => ast.visit(this, context));
    }
    visitPriority(ast: Ast, context: SyntaxErrorContext): any {
        ast.visit(this, context);
    }
}