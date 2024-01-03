import { IType, PrimitiveTypes } from "./token";
export type ExpType = IType;

export class ContextSchemaRepository {
    getAllRegisteredType(): ContextSchema[] {
        return Object.entries(this.storage).filter(a => a[1] instanceof ContextSchema).map(a => a[1] as ContextSchema);
    }
    enumerations() {
        return Object.entries(this.storage).filter(a => a[1] instanceof Enumeration).map(a => a[0]);
    }
    private storage: { [key: string]: ExpType } = {};
    getByName(schemaName: string): ExpType {
        return this.storage[schemaName];
    }
    register(schemaName: string, type: ExpType) {
        this.storage[schemaName] = type;
    }
}
export class DataSource {
    constructor(public url: string, public valueSelector: string, public textSelector: string) {
    }
}
export class Property {
    constructor(public name: string, public caption: string, public primitiveType: IType, public schemaName?: string, public isArray?: boolean, public dataSource?: DataSource) { }
    repository: ContextSchemaRepository = null!;
    get type(): IType {
        var type = this.schemaName ? this.repository.getByName(this.schemaName) : this.primitiveType;
        if (this.isArray)
            type = new Enumerable(type);
        return type;
    }
}
export class Method {
    constructor(public name: string, public caption: string, public signeture: MethodSigneture) {
    }
}
export class ExtensionMethod extends Method {
    constructor(name: string, caption: string, public methodContext: IType, signeture: MethodSigneture) {
        super(name, caption, signeture);
        signeture.methodContext = methodContext as ContextSchema;
    }
    makeGenericMethod(specificTypes: { [key: string]: IType }) {
        return this.signeture.makeGenericType(specificTypes);
    }
}
export class MethodSigneture implements IType {
    specificArguments: { [key: string]: IType } = {};
    setSpecifitType(name: string, arg1: IType) {
        this.specificArguments[name] = arg1;
    }
    methodContext: ContextSchema | undefined;
    constructor(
        public returnType: IType,
        public parameters: IType[],
        public name: string = "method") {
    }
    get genericArguments(): Array<IType> {
        return this.parameters.filter(p => p instanceof GenericType);
    }
    makeGenericType(specificTypes: { [key: string]: IType }) {
        specificTypes = { ...specificTypes, ...this.specificArguments };
        var result = new MethodSigneture(
            this.returnType.makeGenericType(specificTypes),
            this.parameters.map(p => p.makeGenericType(specificTypes)),
            this.name);
        result.specificArguments = specificTypes;
        return result;
    }
    isAssignableFrom(type: IType): unknown {
        return type instanceof MethodSigneture &&
            this.parameters.length === type.parameters.length;
    }

}
export class Enumerable implements IType {
    constructor(public elementType: IType) { }
    get name(): string { return "enumerable" }
    get genericArguments(): Array<IType> {
        return [this.elementType];
    }
    makeGenericType(specificTypes: { [key: string]: IType }): IType {
        return new Enumerable(this.elementType.makeGenericType(specificTypes));
    }

    isAssignableFrom(type: IType): unknown {
        return type instanceof Enumerable && this.elementType.isAssignableFrom(type.elementType);
    }

}
export class GenericType implements IType {
    constructor(public name: string, public innerType: IType | null = null) { }

    get genericArguments(): IType[] {
        return [this];
    }
    makeGenericType(specificTypes: { [key: string]: IType }): IType {
        return specificTypes[this.name] || this;
    }
    isAssignableFrom(type: IType): unknown {
        return true;
    }

}
export class Enumeration implements IType {
    constructor(public name: string, public items: { value: string, text: string }[]) {
    }
    get genericArguments(): Array<IType> {
        return [];
    }
    makeGenericType(specificTypes: { [key: string]: IType }): IType {
        return this;
    }
    isAssignableFrom(type: IType): unknown {
        return this === type;
    }

}
export class ContextSchema implements IType {
    static extensionMethods: Array<ExtensionMethod> = [
        // new ExtensionMethod("AddDays", "AddDays", PrimitiveTypes.datetime, new MethodSigneture(PrimitiveTypes.datetime, [PrimitiveTypes.number])),
        // new ExtensionMethod("Exists", "Exists", new Enumerable(new GenericType(0)),
        //     new MethodSigneture(PrimitiveTypes.bool, [
        //         new MethodSigneture(PrimitiveTypes.bool, [new GenericType(0)])])),
        // new ExtensionMethod("Max", "Max", new Enumerable(new GenericType(0)),
        //     new MethodSigneture(PrimitiveTypes.number, [
        //         new MethodSigneture(PrimitiveTypes.number, [new GenericType(0)])])),
        // new ExtensionMethod("Min", "Min", new Enumerable(new GenericType(0)),
        //     new MethodSigneture(PrimitiveTypes.number, [
        //         new MethodSigneture(PrimitiveTypes.number, [new GenericType(0)])])),
        // new ExtensionMethod("Avg", "Avg", new Enumerable(new GenericType(0)),
        //     new MethodSigneture(PrimitiveTypes.number, [
        //         new MethodSigneture(PrimitiveTypes.number, [new GenericType(0)])])),
        // new ExtensionMethod("Count", "Count ", new Enumerable(new GenericType(0)),
        //     new MethodSigneture(PrimitiveTypes.number, [
        //         new MethodSigneture(PrimitiveTypes.number, [new GenericType(0)])])),
        // new ExtensionMethod("Sum", "Sum ", new Enumerable(new GenericType(0)),
        //     new MethodSigneture(PrimitiveTypes.number, [
        //         new MethodSigneture(PrimitiveTypes.number, [new GenericType(0)])])),
        // new ExtensionMethod("Filter", "Filter ", new Enumerable(new GenericType(0)),
        //     new MethodSigneture(new Enumerable(new GenericType(0)), [
        //         new MethodSigneture(PrimitiveTypes.bool, [new GenericType(0)])])),
    ];
    constructor(public repository: ContextSchemaRepository,
        public name: string,
        public properties: Property[],
        public methods: Method[],
        public constructors: Method[]) {
        for (const p of properties) {
            p.repository = repository;
        }
    }
    get genericArguments(): Array<IType> {
        return [];
    }
    makeGenericType(): IType {
        return this;
    }
    isAssignableFrom(type: IType): unknown {
        return type instanceof ContextSchema && this.name === type.name;
    }

    addProperty(property: Property) {
        this.properties.push(property);
        property.repository = this.repository;
    }
    create() {
        return new ContextSchema(this.repository, "anonymous", [], [], []);
    }
    clone(): IType {
        return this;
    }
}