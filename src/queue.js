
import { List } from './list';

export default class Queue extends List {
  constructor(L = []) {
    super(L);
  }

  enqueue(e) {
    this.insertAsLast(e);
  }

  dequeue() {
    return this.remove(this.first());
  }

  front() {
    return this.first().data;
  }
}
