import { Entry } from './skiplist';
import { Vector } from ''

class BitMap {
  constructor(n) {
    this.values = Array.from({ length: n }, v => false);
  }

  test(n) {
    return this.values[n];
  }

  set(n) {
    this.values[n] = true;
  }
}

class HashTable {
  constructor(c = 5) {
    this.M = this.getPrime(c, 1048576);
    this.N = 0;
    this.ht = [];
    this.lazyRemoval = new BitMap(this.M);
  }

  size() {
    return this.N;
  }

  put(k, v) {
    if (this.ht[this.probe4Hit(k)]) {
      return false;
    }
    const r = this.probe4Free(k);
    this.ht[r] = new Entry(k, v);
    this.N++;
    if (this.N * 2 > this.M) {
      this.rehash();
    }
    return true;
  }

  probe4Free(k) {
    let r = this.hashCode(k) % this.M;
    while (this.ht[r]) {
      r = (r + 1) % this.M;
    }
    return r;
  }

  get(k) {
    const r = this.probe4Hit(k);
    return this.ht[r] ? this.ht[r].value : null;
  }

  probe4Hit(k) {
    let r = this.hashCode(k) % this.M;
    while ((this.ht[r] && (k !== this.ht[r].key)) || (!this.ht[r] && this.lazilyRemoved(r))) {
      r = (r + 1) % this.M;
    }
    return r;
  }

  remove(k) {
    const r = this.probe4Hit(k);
    if (!this.ht[r]) {
      return false;
    }
    this.ht[r] = null;
    this.markAsRemoved(r);
    this.N--;
    return true;
  }

  lazilyRemoved(x) {
    this.lazyRemoval.test(x);
  }

  markAsRemoved(x) {
    this.lazyRemoval.set(x);
  }

  rehash() {
    const oldCapacity = this.M;
    this.M = oldCapacity * 2;
    this.N = 0;
    this.lazyRemoval = new BitMap(M);
    const oldHt = this.ht.slice();
    this.ht = [];
    for (let i = 0; i < oldCapacity; i++) {
      if (oldHt[i]) {
        this.put(this.ht[i].key, this.ht[i].value);
      }
    }
  }

  static hashCode(c) {
    if (c instanceof String) {
      let h;
      for (let n = c.length, i = 0; i < n; i++) {
        h = (h << 5) | (h >> 27);
        h += c[i];
      }
      return h;
    }
    return c;
  }

  static getPrime(lo, hi) {
    const sivies = [];
    const primes = [];
    for (let i = lo; i < hi; i++) {
      if (!sivies[i]) {
        primes.push(i);
        for (let j = i * 2; j < hi; j += i) {
          sivies[j] = true;
        }
      }
    }
    const rank = Math.floor(Math.random() * (hi - lo)) + lo;
    return primes[rank];
  }

  static bucketSort(array, bucketSize = 5) {
    const arr = new Vector(array);
    let min = arr.get(0);
    let max = arr.get(0);

    for (let i = 1; i < arr.size(); i++) {
      if (min > arr.get(i)) {
        min = arr.get(i);
      } else if (max < arr.get(i)) {
        max = arr.get(i);
      }
    }

    const hash = x => Math.floor(x - min) / bucketSize;
    const bucketCount = Math.floor((max - min) / bucketSize) + 1;
    const buckets = new Array(bucketCount);

    for (let i = 0; i < bucketCount; i++) {
      buckets[i] = new Vector();
    }

    for (let i = 0; i < arr.size(); i++) {
      buckets[hash(arr.get(i))].push(arr.get(i));
    }

    return buckets.reduce((output, bucket) => {
      bucket.insertionSort(0, bucket.size());
      return output.concat(bucket.raw());
    }, []);
  }

  static maxGap(array) {
    // hash = (x - lo) * (n - 1) / (hi - lo) = (x - lo) / w
  }

  static countSortBySignificantDigit(array, exponent, radix, min) {
    const buckets = Array(radix).fill(0);
    const output = [];

    for (let i = 0; i < array.length; i++) {
      const bucketIndex = Math.floor(((array[i] - min) / exponent) % radix);
      buckets[bucketIndex]++;
    }

    for (let i = 1; i < radix; i++) {
      buckets[i] += buckets[i - 1];
    }

    for (let i = array.length - 1; i >= 0; i--) {
      const bucketIndex = Math.floor(((array[i] - min) / exponent) % radix);
      output[--buckets[bucketIndex]] = array[i];
    }

    return output;
  }

  static radixSort(array, radix = 10) {
    const min = array.reduce((pred, curr) => (pred > curr ? curr : pred));
    const max = array.reduce((pred, curr) => (pred < curr ? curr : pred));

    let exponent = 1;
    while ((max - min) / exponent >= 1) {
      array = HashTable.countSortBySignificantDigit(array, exponent, radix, min);
      exponent *= radix;
    }
    return array;
  }
}

export {
  BitMap,
  HashTable,
};
