import { Operations } from "./token";


export let OperationOrders: { [key: string]: number } = {
}
OperationOrders[Operations.power] = 10;

OperationOrders[Operations.begin_parentese] = 9;

OperationOrders[Operations.multiply] = OperationOrders[Operations.devide] = 8;

OperationOrders[Operations.plus] = OperationOrders[Operations.minus] = 6;

OperationOrders[Operations.module] = 4;

OperationOrders[Operations.is] = OperationOrders[Operations.isNot] =
OperationOrders[Operations.startsWith] = OperationOrders[Operations.notStartsWith] =
    OperationOrders[Operations.endsWith] = OperationOrders[Operations.notEndsWith] =
    OperationOrders[Operations.contains] = OperationOrders[Operations.notContains] = 2;

OperationOrders[Operations.after] = OperationOrders[Operations.afterOrEq] =
OperationOrders[Operations.before] = OperationOrders[Operations.beforeOrEq] =
OperationOrders[Operations.eq] = OperationOrders[Operations.neq] =
    OperationOrders[Operations.lt] = OperationOrders[Operations.lte] =
    OperationOrders[Operations.gt] = OperationOrders[Operations.gte] = 2;

OperationOrders[Operations.end_parentese] = OperationOrders[Operations.and] = OperationOrders[Operations.or] = 0;
