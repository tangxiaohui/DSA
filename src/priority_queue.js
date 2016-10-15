import Vector from './vector';
import { BinTree, BinNode } from './binary_tree';
import { lt } from './util';

// base class, define the API of PriortyQueue
const priortyQueueMixin = Base =>
  class extends Base {
    insert(e) {
      super.insert(e);
    }
  };

class CompleteHeap extends priortyQueueMixin(Vector) {
  constructor(elements = []) {
    super(elements);
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

  static heapSort(a) {
    const heap = new CompleteHeap(a);
    let i = a.length;
    while (!heap.empty()) {
      a[--i] = heap.delMax();
    }
  }
}

class LeftHeap extends priortyQueueMixin(BinTree) {
  constructor(elements = []) {
    super();
    for (let i = 0; i < elements.length; i++) {
      this.insert(elements[i]);
    }
  }

  insert(e) {
    const v = new BinNode(e);
    this.root = LeftHeap.merge(this.root, v);
    this.root.parent = null;
    this.size++;
  }

  getMax() {
    return this.root.data;
  }

  delMax() {
    const lHeap = this.root.lc;
    const rHeap = this.root.rc;
    const e = this.root.data;
    --this.size;
    this.root = LeftHeap.merge(lHeap, rHeap);
    if (this.root) {
      this.root.parent = null;
    }
    return e;
  }

  static merge(a, b) {
    // recuse base
    if (!a) {
      return b;
    }
    // recuse base
    if (!b) {
      return a;
    }
    // choose bigger one as parent
    if (lt(a.data, b.data)) {
      const temp = a;
      a = b;
      b = temp;
    }
    // merge a.rc and b
    a.rc = LeftHeap.merge(a.rc, b);
    a.rc.parent = a;
    // keep npl(lc) >= npl(rc)
    if (!a.lc || a.lc.npl < a.rc.npl) {
      const temp = a.lc;
      a.lc = a.rc;
      a.rc = temp;
    }
    // update npl(x)
    a.npl = a.rc ? a.rc.npl + 1 : 1;
    return a;
  }
}

export {
  LeftHeap,
  CompleteHeap,
};

