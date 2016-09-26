import { rand } from './util';
import Fib from './fib';

export default class Vector {
  constructor(array) {
    this._elems = Array.from(array);
  }

  _swap(a, b) {
    var temp = this._elems[a];
    this._elems[a] = this._elems[b];
    this._elems[b] = temp;
  }

  bubble(lo, hi) {
    var sorted = true;
    while (++lo < hi) {
      if (this._elems[lo-1] > this._elems[lo]) {
        sorted = false;
        this._swap(lo - 1, lo);
      }
    }
    return sorted;
  }

  bubbleSort(lo, hi) {
    while (!this.bubble(lo, hi--));
  }

  _max(lo, hi) {
    var max = lo;
    for (var i = lo; i < hi; i++) {
      if (this._elems[max] < this._elems[i]) {
        max = i;
      }
    }
    return max;
  }

  selectionSort(lo, hi) {
    for (var i = hi; 1 < i; i--) {
      var max = this._max(lo, i);
      this._swap(max, i - 1);
    }
  }

  insertionSort(lo, hi) {
    for (var i = lo + 1; i < hi; i++) {
      var e = this._elems[i];
      var p = this.binSearch(e, lo, i);
      this.insert(p+1, e);
    }
  }

  merge(lo, mi, hi) {
    var la = mi - lo;
    var lb = hi - mi;
    var tempA = this._elems.slice(lo, mi);
    var tempB = this._elems.slice(mi, hi);
    for (var i = lo, j = 0, k = 0; (j < la) || (k < lb);) {
      if ((j < la) && (!(k < lb) || (tempA[j] <= tempB[k]))) {
        this._elems[i++] = tempA[j++];
      }
      if ((k < lb) && (!(j < la) || (tempB[k] < tempA[j]))) {
        this._elems[i++] = tempB[k++];
      }
    }
  }

  mergeSort(lo, hi) {
    if (hi - lo < 2) {
      return;
    }
    var mi = Math.round((lo + hi) / 2);
    this.mergeSort(lo, mi);
    this.mergeSort(mi, hi);
    this.merge(lo, mi, hi);
  }

  partition(lo, hi) {

  }

  quickSort(lo, hi) {

  }

  heapSort(lo, hi) {

  }

  // 只读接口
  size() {
    return this._elems.length;
  }

  empty() {
    return !this.size();
  }

  disordered() {
    var n = 0;
    for (var i = 1; i < this._elems.length; i++) {
      if (this._elems[i - 1] > this._elems[i]) {
        n++;
      }
    }
    return n;
  }

  // 无序查找
  find(e) {
    return this._find(e, 0, this.size());
  }

  _find(e, lo, hi) {
    while ((lo < hi--) && (e !== this._elems[hi])); // 从后向前查找
    return hi;  // 失败返回 lo - 1
  }

  // 有序查找
  search(e) {
    return 0 <= this.size() ? this.binSearch(e, 0, this.size()) : -1; 
  }

  binSearch(e, lo, hi) {
    while (lo < hi) {
      var mi = (lo + hi) >> 1;
      (e < this._elems[mi]) ? hi = mi : lo = mi + 1;
    }
    return --lo;  // 返回不大于 e 的最大秩，找不到返回-1
  }

  // 可写访问接口
  get(r) {
    return this._elems[r];
  }

  set(r, e) {
    return this._elems[r] = e;
  }

  remove(r) {
    var e = this._elems[r];
    this._remove(r, r + 1);
    return e;
  }

  _remove(lo, hi) {
    if (lo === hi) {
      return 0;
    }
    while (hi < this.size()) {
      this._elems[lo++] = this._elems[hi++];
    }
    this._elems.splice(lo);
    return hi - lo;
  }

  insert(r, e) {
    if (e === undefined) {
      e = r;
      r = this.size();
    }
    for (var i = this.size(); i > r; i--) {
      this._elems[i] = this._elems[i - 1];
    }
    this._elems[r] = e;
    console.log(this._elems);
    return r;
  }

  sort() {
    return this._sort(0, this.size());
  }

  _sort(lo, hi) {
    switch (rand() % 5) {
      case 1: bubbleSort(lo, hi);
        break;
      case 2: selectionSort(lo, hi);
        break;
      case 3: mergeSort(lo, hi);
        break;
      case 4: headSort(lo, hi);
        break;
      default: quickSort(lo, hi);
        break;
    }
  }

  unsort() {
    this._unsort(0, this.size());
  }

  _unsort(lo, hi) {
    for (var i = hi; i > 0; i--) {
      this._swap(i - 1, rand() % i);
    }
  }

  deduplicate() {
    var oldSize = this.size();
    var i = 1;
    while (i < this.size()) {
      (this._find(this._elems[i], 0, i) < 0) ?
      i++: this.remove(i);
    }
    return oldSize - this.size();
  }

  uniquify() {
    var i = 0;
    var j = 0;
    while (j++ < this.size()) {
      if (this._elems[j] !== this._elems[i]) {
        this._elems[++i] = this._elems[j];
      }
    }
    ++i;
    return j - i;
  }

  traverse(visit) {
    for (var i = 0; i < this.size(); i++) {
      visit(this._elems[i]);
    }
  }
};

module.exports = Vector;