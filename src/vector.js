import { rand } from './util';

export default class Vector {
  constructor(array = []) {
    if (array instanceof Vector) {
      this.elems = Array.from(array.elems);
    } else {
      this.elems = Array.from(array);
    }
  }

  swap(a, b) {
    const temp = this.elems[a];
    this.elems[a] = this.elems[b];
    this.elems[b] = temp;
  }

  bubble(lo, hi) {
    let sorted = true;
    while (++lo < hi) {
      if (this.elems[lo - 1] > this.elems[lo]) {
        sorted = false;
        this.swap(lo - 1, lo);
      }
    }
    return sorted;
  }

  bubbleSort(lo, hi) {
    while (!this.bubble(lo, hi--));
  }

  max(lo, hi) {
    let max = lo;
    for (let i = lo; i < hi; i++) {
      if (this.elems[max] < this.elems[i]) {
        max = i;
      }
    }
    return max;
  }

  selectionSort(lo, hi) {
    for (let i = hi; i > 1; i--) {
      this.swap(this.max(lo, i), i - 1);
    }
  }

  insertionSort(lo, hi) {
    for (let i = lo + 1; i < hi; i++) {
      const e = this.elems[i];
      const p = this.binSearch(e, lo, i);
      this.insert(p + 1, e);
    }
  }

  merge(lo, mi, hi) {
    const la = mi - lo;
    const lb = hi - mi;
    const tempA = this.elems.slice(lo, mi);
    const tempB = this.elems.slice(mi, hi);
    for (let i = lo, j = 0, k = 0; (j < la) || (k < lb);) {
      if ((j < la) && (!(k < lb) || (tempA[j] <= tempB[k]))) {
        this.elems[i++] = tempA[j++];
      }
      if ((k < lb) && (!(j < la) || (tempB[k] < tempA[j]))) {
        this.elems[i++] = tempB[k++];
      }
    }
  }

  mergeSort(lo, hi) {
    if (hi - lo < 2) {
      return;
    }
    const mi = Math.round((lo + hi) / 2);
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
    return this.elems.length;
  }

  empty() {
    return !this.size();
  }

  disordered() {
    let n = 0;
    for (let i = 1; i < this.elems.length; i++) {
      if (this.elems[i - 1] > this.elems[i]) {
        n++;
      }
    }
    return n;
  }

  // 无序查找
  find(e) {
    return this.findInRange(e, 0, this.size());
  }

  findInRange(e, lo, hi) {
    while ((lo < hi--) && (e !== this.elems[hi])); // 从后向前查找
    return hi;  // 失败返回 lo - 1
  }

  // 有序查找
  search(e) {
    return this.size() >= 0 ? this.binSearch(e, 0, this.size()) : -1;
  }

  binSearch(e, lo, hi) {
    while (lo < hi) {
      const mi = Math.floor((lo + hi) / 2);
      (e < this.elems[mi]) ? hi = mi : lo = mi + 1;
    }
    return --lo;  // 返回不大于 e 的最大秩，找不到返回-1
  }

  // 可写访问接口
  get(r) {
    return this.elems[r];
  }

  set(r, e) {
    this.elems[r] = e;
    return this.elems[r];
  }

  remove(r) {
    const e = this.elems[r];
    this.removeInRange(r, r + 1);
    return e;
  }

  removeInRange(lo, hi) {
    if (lo === hi) {
      return 0;
    }
    while (hi < this.size()) {
      this.elems[lo++] = this.elems[hi++];
    }
    this.elems.splice(lo);
    return hi - lo;
  }

  insert(r, e) {
    if (e === undefined) {
      e = r;
      r = this.size();
    }
    for (let i = this.size(); i > r; i--) {
      this.elems[i] = this.elems[i - 1];
    }
    this.elems[r] = e;
    return r;
  }

  sort() {
    return Vector.sortInRange(0, this.size());
  }

  static sortInRange(lo, hi) {
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
    this.unsortInRange(0, this.size());
  }

  unsortInRange(lo, hi) {
    for (let i = hi; i > 0; i--) {
      this.swap(i - 1, rand() % i);
    }
  }

  deduplicate() {
    const oldSize = this.size();
    let i = 1;
    while (i < this.size()) {
      (this.findInRange(this.elems[i], 0, i) < 0) ?
      i++ : this.remove(i);
    }
    return oldSize - this.size();
  }

  uniquify() {
    let i = 0;
    let j = 0;
    while (j++ < this.size()) {
      if (this.elems[j] !== this.elems[i]) {
        this.elems[++i] = this.elems[j];
      }
    }
    ++i;
    return j - i;
  }

  traverse(visit) {
    for (let i = 0; i < this.size(); i++) {
      visit(this.elems[i]);
    }
  }
}

module.exports = Vector;
