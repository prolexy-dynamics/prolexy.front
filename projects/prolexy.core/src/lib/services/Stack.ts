export class Stack<T> {
    private _items: Array<T> = [];
    private set items(items: Array<T>) {
        this._items = items;
    }
    public get items(){
        return this._items;
    }
    public iterator(): Array<T> {
        return [...this._items];
    }
    push(item: T) {
        this.items.push(item);
    }
    pop(): T | undefined {
        return this.items.pop();
    }
    peek() {
        return this.items[this.items.length - 1];
    }
    any(): boolean {
        return this.items.length > 0;
    }
    clear() {
        this.items.splice(0, this.items.length);
    }
}
