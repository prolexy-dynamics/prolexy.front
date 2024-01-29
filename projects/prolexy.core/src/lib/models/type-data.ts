import { ContextSchema, ContextSchemaRepository, DataSource, Enumerable, Enumeration, ExtensionMethod, GenericType, Method, MethodParameter, MethodSigneture, Property } from "./context-schema";
import { IType, PrimitiveTypes } from "./token";

export enum TypeCategory {
    Primitive = 0,
    Enum = 1,
    Complex = 2,
    Method = 3,
    Enumerable = 4,
    Generic = 5,
    ReferenceType = 6
}
function getTypeData(category: TypeCategory): Function {
    switch (category) {
        case TypeCategory.Primitive: return PrimitiveTypeData;
        case TypeCategory.Enum: return EnumTypeData;
        case TypeCategory.Complex: return ComplexTypeData;
        case TypeCategory.Method: return MethodSignatureData;
        case TypeCategory.Enumerable: return EnumerableTypeData;
        case TypeCategory.Generic: return GenericTypeData;
        case TypeCategory.ReferenceType: return ComplexTypeReferenceData;
    }
}
function convert(obj: any): ITypeData {
    var prototype = getTypeData(obj.category).prototype;
    var result = Object.create(prototype) as ITypeData;
    result.assign(obj);
    return result;
}
export class ProlexyContext{
    businessObjectTypeData: ComplexTypeData = null!;
    extensionMethods: Array<MethodSignatureData> = [];
    complexDataTypes: Array<ComplexTypeData> = [];
}
export function createTypeFromJson(repository: ContextSchemaRepository, json: ProlexyContext) {
    var ctx = new context(repository,
        convert(json.businessObjectTypeData) as ComplexTypeData,
        json.complexDataTypes.map((t: any) => convert(t) as ComplexTypeData));
    ContextSchema.extensionMethods = json.extensionMethods
        .map((m: MethodSignatureData) => convert(m) as MethodSignatureData)
        .map((m: MethodSignatureData) => new ExtensionMethod(
            m.name,
            m.name,
            m.contextType.createType(ctx),
            m.createType(ctx) as MethodSigneture));
    return ctx;
}
export class context {
    constructor(public readonly repository: ContextSchemaRepository,
        public businessObjectTypeData: ComplexTypeData,
        public complexTypes: Array<ComplexTypeData>) { }
}
export interface ITypeData {
    assign(obj: any): unknown;
    name: string;
    category: TypeCategory;
    createType(context: context): IType;
}
export class ComplexTypeReferenceData implements ITypeData {
    constructor(
        public name: string
    ) { }
    category: TypeCategory = TypeCategory.ReferenceType;

    createType(context: context): IType {
        var result = context.repository.getByName(this.name) as ContextSchema;
        if (!result) {
            result = new ContextSchema(context.repository,
                this.name,
                [],
                [],
                []);
            context.repository.register(this.name, result);
            var tmp = context.complexTypes.find(t => t.name === this.name)!.createType(context) as ContextSchema;
            result.properties = tmp.properties;
            result.methods = tmp.methods;
        }
        return result;
    }
    assign(obj: any) {
        Object.assign(this, obj);
    }
}
export class GenericTypeData implements ITypeData {
    constructor(
        public name: string
    ) { }
    category: TypeCategory = TypeCategory.ReferenceType;

    createType(context: context): IType {
        return new GenericType(this.name);
    }
    assign(obj: any) {
        Object.assign(this, obj);
    }
}
export class ComplexTypeData implements ITypeData {
    constructor(public name: string,
        public properties: Array<PropertyData>,
        public methods: Array<MethodData>,
        public constructors: Array<MethodData>) {
    }
    category: TypeCategory = TypeCategory.Complex;

    createType(context: context): IType {
        var result = new ContextSchema(context.repository,
            this.name,
            this.properties.map(p => p.createProperty(context)),
            this.methods.map(m => m.createMethod(context)),
            this.constructors.map(m => m.createMethod(context)));
        context.repository.register(result.name, result);
        return result;
    }
    assign(obj: any) {
        Object.assign(this, obj);
        this.properties = obj.properties
            .map((p: any) =>
                new PropertyData(p.propertyName, convert(p.propertyType)));
        this.methods = (obj.methods || [])
            .map((m: any) =>
                new MethodData(m.name,
                    convert(m.contextType),
                    m.parameters.map((p: any) => new ParameterData(p.parameterName, convert(p.parameterType),
                        p.dataSource
                            ? new DataSource(p.dataSource.url, p.dataSource.valueSelector, p.dataSource.textSelector)
                            : undefined)),
                    convert(m.returnType)));
        this.constructors = (obj.constructors || [])
            .map((m: any) =>
                new MethodData(m.name,
                    convert(m.contextType),
                    m.parameters.map((p: any) => new ParameterData(p.parameterName, convert(p.parameterType),
                        p.dataSource
                            ? new DataSource(p.dataSource.url, p.dataSource.valueSelector, p.dataSource.textSelector)
                            : undefined)),
                    convert(m.returnType)));
    }
}
class PropertyData {
    createProperty(context: context): any {
        return new Property(this.propertyName,
            this.propertyName,
            this.propertyType.createType(context));
    }
    constructor(public propertyName: string, public propertyType: ITypeData) { }
}
export class MethodSignatureData implements ITypeData {
    constructor(
        public name: string,
        public contextType: ITypeData,
        public parameters: Array<ParameterData>,
        public returnType: ITypeData) { }
    assign(obj: any) {
        Object.assign(this, obj);
        this.returnType = convert(obj.returnType);
        this.contextType = convert(obj.contextType);
        this.parameters = obj.parameters.map((p: any) =>
            new ParameterData(p.parameterName,
                convert(p.parameterType),
                p.dataSource
                    ? new DataSource(p.dataSource.url, p.dataSource.valueSelector, p.dataSource.textSelector)
                    : undefined));
    }
    category: TypeCategory = TypeCategory.Method;

    createType(context: context): IType {
        return new MethodSigneture(
            this.returnType.createType(context),
            this.parameters.map(p =>
                new MethodParameter(
                    p.parameterName,
                    p.parameterType.createType(context),
                    p.dataSource)),
            this.name);
    }
}
export class MethodData {
    constructor(
        public methodName: string,
        public contextType: ITypeData,
        public parameters: Array<ParameterData>,
        public returnType: ITypeData) { }

    createMethod(context: context): Method {
        return new Method(this.methodName,
            this.methodName,
            new MethodSigneture(
                this.returnType.createType(context),
                this.parameters.map(p =>
                    new MethodParameter(
                        p.parameterName,
                        p.parameterType.createType(context),
                        p.dataSource))));
    }

}
class ParameterData {
    constructor(public parameterName: string, public parameterType: ITypeData, public dataSource?: DataSource) { }
}
export class EnumTypeData implements ITypeData {
    constructor(public name: string, public items: Array<string>) {
    }
    assign(obj: any) {
        Object.assign(this, obj);
    }
    category: TypeCategory = TypeCategory.Enum;

    createType(context: context): IType {
        var enumeration = context.repository.getByName(this.name);
        if (enumeration) return enumeration;
        enumeration = new Enumeration(this.name, this.items.map(it => ({ value: it, text: it })));
        context.repository.register(this.name, enumeration);
        return enumeration;
    }
}
export class PrimitiveTypeData implements ITypeData {
    constructor(public name: string) {
    }
    assign(obj: any) {
        this.name = obj.name;
        this.category = TypeCategory.Primitive;
    }
    category: TypeCategory = TypeCategory.Primitive;

    createType(context: context): IType {
        return PrimitiveTypes.fromName(this.name)!;
    }
}
export class EnumerableTypeData implements ITypeData {
    constructor(public name: string, public elementType: ITypeData) {
    }
    assign(obj: any) {
        Object.assign(this, obj);
        this.elementType = convert(obj.elementType);
    }
    category: TypeCategory = TypeCategory.Enumerable;

    createType(context: context): IType {
        return new Enumerable(this.elementType.createType(context));
    }
}