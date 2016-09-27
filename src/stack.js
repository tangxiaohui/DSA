import Vector from './vector';


export default class Stack extends Vector {
  constructor(L) {
    super(L);
  }

  push(e) {
    return this.insert(this.size(), e);
  }

  pop() {
    return this.remove(this.size() - 1);
  }

  top() {
    return this.get(this.size() - 1);
  }
}
