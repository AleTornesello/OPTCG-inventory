import {Collection} from "./collection";

export interface Stack<T> {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  size(): number;
}

export class StackCollection<T> extends Collection<T> implements Stack<T> {
  constructor(private capacity: number = Infinity) {
    super();
  }

  push(item: T) {
    if (this.isFull()) {
      throw Error("Stack has reached max capacity, you cannot add more items");
    }
    // In the derived class, we can access protected properties of the abstract class
    this.storage.push(item);
  }

  pop(): T | undefined {
    return this.storage.pop();
  }

  peek(): T | undefined {
    return this.storage[this.size() - 1];
  }

  // Implementation of the abstract method
  isFull(): boolean {
    return this.capacity === this.size();
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }
}
