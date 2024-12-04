export abstract class Collection<T> {
  protected storage: T[] = [];

  size(): number {
    return this.storage.length;
  }

  clear(): void {
    this.storage = [];
  }

  abstract isFull(): boolean;
  abstract isEmpty(): boolean;
}
