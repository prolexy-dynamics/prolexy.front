import { ContextSchema, Enumeration, ExpType, ExtensionMethod, MethodSigneture, Property } from '../models/context-schema';
import { dateOperations, IType, KeyWords, logicalOperations, numericOperations, Operations, PrimitiveTypes, relationalOperations, stringOperations, Token, TokenType } from '../models/token';
import { Stack } from '../services/Stack';
import { AccessMember, AnonymousMethod, Assignment, Ast, AstVisitor, Binary, Call, CompositionExpected, Declaration, ExpectedKeywords, ExpectedTokenTypes, IfStatement, ImplicitAccessMember, Instantiation, LiteralPrimitive, Span } from './ast';
export class SemanticErrorContext {
    constructor(public schema: ContextSchema) { }
    errors: Array<{ span: Span, message: string }> = [];
    stackCall: Stack<IType> = new Stack<IType>();
    expectedType: Stack<IType> = new Stack<IType>;
    public get allTypes(): ContextSchema[] {
        return this.schema.repository.getAllRegisteredType();
    }
};
var compatiblityChecker = [
    { operations: [...numericOperations], left: PrimitiveTypes.number, right: PrimitiveTypes.number, result: PrimitiveTypes.number },
    { operations: [...relationalOperations], left: PrimitiveTypes.number, right: PrimitiveTypes.number, result: PrimitiveTypes.bool },
    { operations: [Operations.is, Operations.isNot], left: PrimitiveTypes.datetime, right: PrimitiveTypes.datetime, result: PrimitiveTypes.bool },
    { operations: [Operations.is, Operations.isNot], left: PrimitiveTypes.string, right: PrimitiveTypes.string, result: PrimitiveTypes.bool },
    { operations: [Operations.is, Operations.isNot], left: PrimitiveTypes.bool, right: PrimitiveTypes.bool, result: PrimitiveTypes.bool },
    { operations: [Operations.is, Operations.isNot], left: PrimitiveTypes.enum, right: PrimitiveTypes.enum, result: PrimitiveTypes.bool },
    { operations: [...logicalOperations], left: PrimitiveTypes.bool, right: PrimitiveTypes.bool, result: PrimitiveTypes.bool },
    { operations: [...stringOperations], left: PrimitiveTypes.string, right: PrimitiveTypes.string, result: PrimitiveTypes.bool },
    { operations: [...dateOperations], left: PrimitiveTypes.datetime, right: PrimitiveTypes.datetime, result: PrimitiveTypes.bool },
];
export class SemanticErrorAnalizer implements AstVisitor<SemanticErrorContext> {
    visitCompositExpectations(ast: CompositionExpected, context: SemanticErrorContext) {
    }
    visit?(ast: Ast, context?: any) {
    }
    visitExpectedDeclaration(declaration: Declaration, context: SemanticErrorContext) {
    }
    visitExpectedKeywords(ast: ExpectedKeywords, context: SemanticErrorContext) {
    }
    visitExpectedTokenTypes(ast: ExpectedTokenTypes, context: SemanticErrorContext) {
    }
    visitDeclaration(declaration: Declaration, context: SemanticErrorContext) {
    }
    visitIfStatement(ifStatement: IfStatement, context: SemanticErrorContext): any {
    }
    visitInstantiate(ast: Instantiation, context: SemanticErrorContext): any {
        return context.allTypes.find(t => t.name === ast.typeIdentification?.value);
    }
    visitAssignment(assignment: Assignment, context: SemanticErrorContext): any {
        var leftType = assignment.left.visit(this, context) as ExpType;
        var rightType = assignment.right.visit(this, context);
        if (leftType instanceof Enumeration) {
            if (!leftType.items.find(e => e.value === rightType?.value && e.text === rightType?.text))
                context.errors.push({ span: assignment.right.span, message: `type mismatch: type: ${rightType} is not assignable to enumeration` });
            return;
        }
        if (!this.typesCompatible(leftType, rightType))
            context.errors.push({ span: assignment.right.span, message: `type mismatch: type: ${rightType} is not assignable to ${leftType}` });
    }
    visitBinary(binary: Binary, context: SemanticErrorContext): any {
        var leftType = binary.left.visit(this, context);
        var rightType = binary.right.visit(this, context);
        if (leftType instanceof Enumeration) {
            if (!leftType.items.find(e => e.value === rightType?.value && e.text === rightType.text))
                context.errors.push({ span: binary.right.span, message: `type mismatch: operation "${binary.operation}" not compatible for enumeration operand` });
            return PrimitiveTypes.bool;
        }
        var entry = compatiblityChecker.find(m => m.operations.find(o => o === binary.operation) && m.left === leftType && m.right === rightType);
        if (!entry) {
            context.errors.push({ span: binary.right.span, message: `type mismatch: operation "${binary.operation}" not compatible with type '${leftType?.name}' and '${rightType?.name}'` })
            return leftType;
        };
        return entry?.result;
    }
    typesCompatible(first: ExpType, second: ExpType): boolean {
        if (first === second)
            return true;
        return false;
    }
    visitCall(ast: Call, context: SemanticErrorContext): any {
        var signature = ast.method.visit(this, context) as MethodSigneture;
        if (!(signature instanceof MethodSigneture)) {
            context.errors.push({ span: ast.method.span, message: `Method not found: method ${ast.method.token.text} not found in the context` });
            return;
        }
        var i = 0;
        for (let arg of ast.args) {
            if (arg instanceof AnonymousMethod) {
                var methodParameters = (signature.parameters[i] as MethodSigneture).parameters;
                var params = (arg as AnonymousMethod).parameters;
                var schem = (context.schema as ContextSchema).create();
                let idx = 0;
                for (const p of params) {
                    schem.addProperty(new Property(p.value!, p.value!, methodParameters[idx]));
                    idx++;
                }
                context.stackCall.push(schem);
            }
            context.expectedType.push(signature.parameters[i]);
            var parameterType = arg.visit(this, context);
            if (parameterType) {
                for (const iterator of signature.parameters[i].genericArguments) {
                    signature.setSpecifitType(iterator.name, parameterType);
                    signature = signature?.makeGenericType({});
                }
            }
            if (arg instanceof AnonymousMethod) context.stackCall.pop();
            i++;
        }
        return signature.returnType;
    }
    visitAnonymousMethod(ast: AnonymousMethod, context: SemanticErrorContext): any {
        var expected = context.expectedType.pop();
        if (!(expected instanceof MethodSigneture))
            context.errors.push({ span: ast.span, message: `expected type is '${expected?.name}' but anonymous method defined here.` })
        var result = ast.expression.visit(this, context) as IType;
        if (!expected) return;
        var returnType = (expected as MethodSigneture).returnType;
        if (!returnType.isAssignableFrom(result))
            context.errors.push({ span: ast.expression.span, message: `expected type is '${returnType?.name}' but expression returns '${result?.name}'.` })
    }
    visitImplicitAccessMember(ast: ImplicitAccessMember, context: SemanticErrorContext): any {
        return this.resolveTypeFormToken(context, undefined, ast.token);
    }
    visitAccessMember(ast: AccessMember, context: SemanticErrorContext): any {
        var result = ast.left.visit(this, context) as IType;
        return this.resolveTypeFormToken(context, result, ast.token);
    }
    resolveTypeFormToken(context: SemanticErrorContext, leftType: IType | undefined, token: Token | undefined): IType {
        var resolver = (schema: ContextSchema) => schema.properties.find(p => p.name === token?.value)?.type ||
            schema.methods.find(p => p.name === token?.value)?.signeture;
        if (leftType instanceof ContextSchema) {
            result = resolver(leftType as ContextSchema);
            if (result)
                return result;
        }
        var result: IType | undefined;
        if (!leftType) {
            for (const schem of context.stackCall.iterator().filter(t => t instanceof ContextSchema)) {
                result = resolver(schem as ContextSchema);
                if (result) return result;
            }
            if (context.schema instanceof ContextSchema) {
                result = resolver(context!.schema);
                if (result) return result;
            }
        }
        var method = ContextSchema.extensionMethods.find(p => p.methodContext.isAssignableFrom(leftType || context.schema) && p.name === token?.value);
        if (!method) return context!.schema;
        var specificTypes = {} as any;
        let pidx = 0;
        for (var garg of method.methodContext.genericArguments) {
            specificTypes[garg.name] = context.schema.genericArguments[pidx++];
        }
        return Object.assign(Object.create(ExtensionMethod.prototype), { caption: method.caption, methodContext: context.schema, signeture: method.signeture })
            .makeGenericMethod(specificTypes);
    }
    visitLiteralPrimitive(ast: LiteralPrimitive, context: SemanticErrorContext): any {
        return ast.token.type === PrimitiveTypes.enum
            ? ast.token
            : (ast.token.type instanceof PrimitiveTypes ? ast.token.type.extendedType ?? ast.token.type : ast.token.type);
    }
    visitAll(statements: Ast[], context: SemanticErrorContext): any {
        statements.forEach(ast => ast.visit(this, context));
    }
    visitPriority(ast: Ast, context: SemanticErrorContext): any {
        return ast.visit(this, context);
    }
}