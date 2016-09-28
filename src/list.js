import { rand } from './util';

class ListNode {
  constructor(data, pred, succ) {
    this.data = data;
    this.pred = pred;
    this.succ = succ;
  }

  insertAsPred(e) {
    var x = new ListNode(e, this.pred, this);
    this.pred.succ = x;
    this.pred = x;
    return x;
  }

  insertAsSucc(e) {
    var x = new ListNode(e, this, this.succ);
    this.succ.pred = x;
    this.succ = x;
    return x;
  }
};

export default class List {
  constructor(L = []) {
    this.init();
    if (L instanceof Array) {
      this.copy(L);
    }
  }

  copy(array) {
    this.clear();
    for (var i = 0; i < array.length; i++) {
      this.insertAsLast(array[i]);
    }
  }

  toArray() {
    var a = [];
    this.traverse(function (x) {
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
    this._size = 0;
  }

  clear() {
    var oldSize = this._size;
    while (0 < this._size) {
      this.remove(this.header.succ);
    }
    return oldSize;
  }

  _merge(p, n, q, m) {
    var first = p; // 记录第一个节点
    while (0 < m) {
      if ((0 < n) && (p.data <= q.data)) {
        if (q == (p = p.succ)) {
          break;
        }
        n--;
      } else {
        q = q.succ;
        var newInsert = this.insertB(p, this.remove(q.pred));
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
    var m = n >> 1;
    var q = p;
    for (var i = 0; i < m; i++) {
      q = q.succ;
    }
    p = this.mergeSort(p, m);
    q = this.mergeSort(q, n - m);
    return this._merge(p, m, q, n - m);
  }

  // 在任何时刻，S[r, n)已经有序，且不小于前缀 S[0, r)
  selectionSort(p, n) {
    var head = p.pred;
    var tail = p;
    for (var i = 0; i < n; i++) {
      tail = tail.succ;
    }
    while (1 < n) {
      var p = this._selectMax(head.succ, n);
      this.insertB(tail, this.remove(p));
      tail = tail.pred;
      n--;
    }
  }

  insertionSort(p, n) {
    for (var r = 0; r < n; r++) {
      this.insertA(this._search(p.data, r, p), p.data);
      p = p.succ;
      this.remove(p.pred); 
    }
  }

  size() {
    return this._size;
  }

  empty() {
    return this._size <= 0;
  }

  get(r) {
    var p = this.first();
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
    var p = this.header;
    var n = 0;
    for (var cur = p.succ; cur !== this.last(); cur = cur.succ) {
      if (cur.succ.data < cur.data) {
        n++;
      }
    }
    return n;
  }

  find(e) {
    return this._find(e, this._size, this.trailer);
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
    return this._search(e, this._size, this.trailer);
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
    var max = p;
    for (var cur = p; 1 < n; n--) {
      if ((cur = cur.succ).data > max.data) {
        max = cur;
      }
    }
    return max;
  }

  selectMax() {
    return this._selectMax(this.header.succ, this._size);
  }

  insertAsFirst(e) {
    this._size++;
    return this.header.insertAsSucc(e);
  }

  insertAsLast(e) {
    this._size++;
    return this.trailer.insertAsPred(e);
  }

  // e 作为 p 的后缀插入
  insertA(p, e) {
    this._size++;
    return p.insertAsSucc(e);
  }

  // e 作为 p 的前缀插入
  insertB(p, e) {
    this._size++;
    return p.insertAsPred(e);
  }

  remove(p) {
    var e = p.data;
    this._size--;
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
    this._sort(this.first(), this._size());
  }

  deduplicate() {
    if (this._size < 2) {
      return 0;
    }
    var oldSize = this._size;
    var p = this.header;
    var r = 0;
    while (this.trailer !== (p = p.succ)) {
      var q = this._find(p.data, r, p);
      q ? this.remove(q) : r++;
    }
    return oldSize - this._size;
  }

  uniquify() {
    if (this._size < 2) {
      return 0;
    }
    var oldSize = this._size;
    var p = this.first();
    var q;
    while (this.trailer !== (q = p.succ)) {
      if (q.data !== p.data) {
        p = q;
      } else {
        this.remove(q);
      }
    }
    return oldSize - this._size;
  }

  swapData(p, q) {
    var temp = p.data;
    p.data = q.data;
    q.data = temp;
  }

  reverse() {
    var p = this.header;
    var q = this.trailer;
    for (var i = 0; i < this._size; i += 2) {
      this.swapData((p = p.succ), (q = q.pred));
    }
  }

  swapPredSucc(p) {
    var tp = p.pred;
    p.pred = p.succ;
    p.succ = tp;
  }

  reverse2() {
    for (var p = this.header; p; p = p.pred) {
      this.swapPredSucc(p);
    }
    var temp = this.header;
    this.header = this.trailer;
    this.trailer = temp;
  }

  traverse(visit, p) {
    var cur = p || this.first();
    while (cur !== this.trailer) {
      visit(cur.data);
      cur = cur.succ;
    } 
  }
};