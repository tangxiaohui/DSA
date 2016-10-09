import { rand } from './util';

class ListNode {
  constructor(data, pred, succ) {
    this.data = data;
    this.pred = pred;
    this.succ = succ;
  }

  insertAsPred(e) {
    const x = new ListNode(e, this.pred, this);
    this.pred.succ = x;
    this.pred = x;
    return x;
  }

  insertAsSucc(e) {
    const x = new ListNode(e, this, this.succ);
    this.succ.pred = x;
    this.succ = x;
    return x;
  }
}

class List {
  constructor(L = []) {
    this.init();
    if (L instanceof Array) {
      this.copy(L);
    }
  }

  copy(array) {
    this.clear();
    for (let i = 0; i < array.length; i++) {
      this.insertAsLast(array[i]);
    }
  }

  toArray() {
    const a = [];
    this.traverse((x) => {
      a.push(x);
    });
    return a;
  }

  init() {
    this.header = new ListNode(0, null, null);
    this.trailer = new ListNode(0, null, null);
    this.header.succ = this.trailer;
    this.header.pred = null;
    this.trailer.pred = this.header;
    this.trailer.succ = null;
    this.size = 0;
  }

  clear() {
    const oldSize = this.size;
    while (0 < this.size) {
      this.remove(this.header.succ);
    }
    return oldSize;
  }

  _merge(p, n, q, m) {
    let first = p; // 记录第一个节点
    while (0 < m) {
      if ((0 < n) && (p.data <= q.data)) {
        if (q == (p = p.succ)) {
          break;
        }
        n--;
      } else {
        q = q.succ;
        const newInsert = this.insertB(p, this.remove(q.pred));
        if (p === first) {
          first = newInsert;
        }
        m--;
      }
    }
    return first; // 返回二路归并之后的第一个节点
  }

  mergeSort(p, n) {
    if (n < 2) {
      return p; // 平凡情况，返回当前结点
    }
    const m = n >> 1;
    let q = p;
    for (let i = 0; i < m; i++) {
      q = q.succ;
    }
    p = this.mergeSort(p, m);
    q = this.mergeSort(q, n - m);
    return this._merge(p, m, q, n - m);
  }

  // 在任何时刻，S[r, n)已经有序，且不小于前缀 S[0, r)
  selectionSort(p, n) {
    const head = p.pred;
    let tail = p;
    for (let i = 0; i < n; i++) {
      tail = tail.succ;
    }
    while (1 < n) {
      const p = this._selectMax(head.succ, n);
      this.insertB(tail, this.remove(p));
      tail = tail.pred;
      n--;
    }
  }

  insertionSort(p, n) {
    for (let r = 0; r < n; r++) {
      this.insertA(this._search(p.data, r, p), p.data);
      p = p.succ;
      this.remove(p.pred);
    }
  }

  empty() {
    return this.size <= 0;
  }

  get(r) {
    let p = this.first();
    while (0 < r--) {
      p = p.succ;
    }
    return p.data;
  }

  first() {
    return this.header.succ;
  }

  last() {
    return this.trailer.pred;
  }

  valid(p) {
    return p && (this.trailer !== p) && (this.header !== p);
  }

  disordered() {
    const p = this.header;
    let n = 0;
    for (let cur = p.succ; cur !== this.last(); cur = cur.succ) {
      if (cur.succ.data < cur.data) {
        n++;
      }
    }
    return n;
  }

  find(e) {
    return this._find(e, this.size, this.trailer);
  }

  // 在无序列表的n个真前缀中，找到等于e的最后者
  _find(e, n, p) {
    while (0 < n--) {
      if (e === (p = p.pred).data) {
        return p;
      }
    }
    return null;
  }


  search(e) {
    return this._search(e, this.size, this.trailer);
  }

  // 在有序列表内节点 p 的 n 个真前驱中，找到不大于e的最后者
  _search(e, n, p) {
    while (0 <= n--) { // 可能返回 header
      if ((p = p.pred).data <= e) {
        break;
      }
    }
    return p;
  }

  _selectMax(p, n) {
    let max = p;
    for (let cur = p; 1 < n; n--) {
      if ((cur = cur.succ).data > max.data) {
        max = cur;
      }
    }
    return max;
  }

  selectMax() {
    return this._selectMax(this.header.succ, this.size);
  }

  insertAsFirst(e) {
    this.size++;
    return this.header.insertAsSucc(e);
  }

  insertAsLast(e) {
    this.size++;
    return this.trailer.insertAsPred(e);
  }

  // e 作为 p 的后缀插入
  insertA(p, e) {
    this.size++;
    return p.insertAsSucc(e);
  }

  // e 作为 p 的前缀插入
  insertB(p, e) {
    this.size++;
    return p.insertAsPred(e);
  }

  remove(p) {
    const e = p.data;
    this.size--;
    p.succ.pred = p.pred;
    p.pred.succ = p.succ;
    return e;
  }

  _sort(p, n) {
    switch (rand % 3) {
      case 1: insertionSort(p, n); break;
      case 2: selectionSort(p, n); break;
      default: mergeSort(p, n); break;
    }
  }

  sort() {
    this._sort(this.first(), this.size());
  }

  deduplicate() {
    if (this.size < 2) {
      return 0;
    }
    const oldSize = this.size;
    let p = this.header;
    let r = 0;
    while (this.trailer !== (p = p.succ)) {
      const q = this._find(p.data, r, p);
      q ? this.remove(q) : r++;
    }
    return oldSize - this.size;
  }

  uniquify() {
    if (this.size < 2) {
      return 0;
    }
    const oldSize = this.size;
    let p = this.first();
    let q;
    while (this.trailer !== (q = p.succ)) {
      if (q.data !== p.data) {
        p = q;
      } else {
        this.remove(q);
      }
    }
    return oldSize - this.size;
  }

  swapData(p, q) {
    const temp = p.data;
    p.data = q.data;
    q.data = temp;
  }

  reverse() {
    let p = this.header;
    let q = this.trailer;
    for (let i = 0; i < this.size; i += 2) {
      this.swapData((p = p.succ), (q = q.pred));
    }
  }

  swapPredSucc(p) {
    const tp = p.pred;
    p.pred = p.succ;
    p.succ = tp;
  }

  reverse2() {
    for (let p = this.header; p; p = p.pred) {
      this.swapPredSucc(p);
    }
    const temp = this.header;
    this.header = this.trailer;
    this.trailer = temp;
  }

  traverse(visit, p) {
    let cur = p || this.first();
    while (cur !== this.trailer) {
      visit(cur.data);
      cur = cur.succ;
    }
  }
}

export {
  List,
  ListNode,
};
