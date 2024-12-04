import {Collection} from "./collection";
import {Queue} from "./queue";

export class HttpQueueCollection<T> extends Collection<() => Promise<T>> implements Queue<() => Promise<T>> {

  private _currentConcurrency;
  number = 0;

  constructor(private concurrency: number = 4, private capacity: number = Infinity) {
    super();
    this._currentConcurrency = 0;
  }

  enqueue(...item: (() => Promise<T>)[]): void {
    if (this.isFull()) {
      throw Error("Queue has reached max capacity, you cannot add more items");
    }
    // In the derived class, we can access protected properties of the abstract class
    this.storage.push(...item);
    this._runNext();
  }

  dequeue(): (() => Promise<T>) | undefined {
    return this.storage.shift();
  }

  // Implementation of the abstract method
  isFull(): boolean {
    return this.capacity === this.size();
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  private _runNext() {
    if (this.size() > 0 && this._currentConcurrency < this.concurrency) {
      const task = this.dequeue()!;
      this._currentConcurrency++;
      task()
        .then(() => {
          // Handle the result of the task here
        })
        .finally(() => {
          this._currentConcurrency--;
          this._runNext();
        });
    }
  }
}
