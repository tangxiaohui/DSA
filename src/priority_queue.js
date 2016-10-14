import Vector from './vector';
import { lt } from './util';

// base class, define the API of PriortyQueue
class PriortyQueue extends Vector {
  insert(e) {
    super.insert(e);
  }
}

class CompleteHeap extends PriortyQueue {
  constructor(a = []) {
    super(a);
    this.heapify(this.size());
  }

  percolateDown(n, i) {
    let j = CompleteHeap.properParent(this.elems, n, i);
    while (i !== j) {
      this.swap(i, j);
      i = j;
      j = CompleteHeap.properParent(this.elems, n, i);
    }
  }

  percolateUp(i) {
    while (CompleteHeap.parentValid(i)) {
      const j = CompleteHeap.parent(i);
      if (lt(this.elems[i], this.elems[j])) {
        break;
      }
      this.swap(i, j);
      i = j;
    }
  }

  heapify(n) {
    for (let i = CompleteHeap.lastInernal(n); CompleteHeap.inHeap(n, i); i--) {
      this.percolateDown(n, i);
    }
  }

  insert(e) {
    super.insert(e);
    this.percolateUp(this.size() - 1);
  }

  getMax() {
    return this.elems[0];
  }

  delMax() {
    const max = this.elems[0];
    this.elems[0] = this.elems[this.size() - 1];
    this.remove(this.size() - 1);
    this.percolateDown(this.size(), 0);
    return max;
  }

  static inHeap(n, i) {
    return (i > -1) && (i < n);
  }

  static parent(i) {
    return (i - 1) >> 1;
  }

  static lastInernal(n) {
    return CompleteHeap.parent(n - 1);
  }

  static leftChild(i) {
    return (1 + (i << 1));
  }

  static rightChild(i) {
    return ((1 + i) << 1);
  }

  static parentValid(i) {
    return i > 0;
  }

  static leftChildValid(n, i) {
    return CompleteHeap.inHeap(n, CompleteHeap.leftChild(i));
  }

  static rightChildValid(n, i) {
    return CompleteHeap.inHeap(n, CompleteHeap.rightChild(i));
  }

  static bigger(pq, i, j) {
    return lt(pq[i], pq[j]) ? j : i;
  }

  static properParent(pq, n, i) {
    const rightChildValid = CompleteHeap.rightChildValid;
    const leftChildValid = CompleteHeap.leftChildValid;
    const rightChild = CompleteHeap.rightChild;
    const leftChild = CompleteHeap.leftChild;
    const bigger = CompleteHeap.bigger;

    if (rightChildValid(n, i)) {
      return bigger(
        pq, bigger(pq, i, leftChild(i)), rightChild(i)
      );
    } else if (leftChildValid(n, i)) {
      return bigger(
        pq, i, leftChild(i)
      );
    }
    return i;
  }
}

export {
  CompleteHeap,
};

