import { Entry } from './skiplist';
import Vector from './vector';

class BitMap {
  constructor(n) {
    this.values = Array.from({ length: n }, () => false);
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
    this.M = HashTable.getPrime(c, 1000);
    this.N = 0;
    this.ht = Array.from({ length: this.M }, () => null);
    this.lazyRemoval = new BitMap(this.M);
  }

  size() {
    return this.N;
  }

  capacity() {
    return this.M;
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
    let r = HashTable.hashCode(k) % this.M;
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
    let r = HashTable.hashCode(k) % this.M;
    // linear chain probe, break if k = key (success) or null but not mark as removed (fail)
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
    return this.lazyRemoval.test(x);
  }

  markAsRemoved(x) {
    this.lazyRemoval.set(x);
  }

  rehash() {
    const oldCapacity = this.M;
    this.M = oldCapacity * 2;
    this.N = 0;
    this.lazyRemoval = new BitMap(this.M);
    const oldHt = this.ht.slice();
    this.ht = [];
    for (let i = 0; i < oldCapacity; i++) {
      if (oldHt[i]) {
        this.put(this.ht[i].key, this.ht[i].value);
      }
    }
  }

  indexOf(r) {
    return this.ht[r];
  }

  static hashCode(c) {
    if (typeof c === 'string') {
      let h = 0;
      for (let n = c.length, i = 0; i < n; i++) {
        h += c.charCodeAt(i) * Math.pow(33, n - 1 - i);
      }
      return h;
    }
    return c;
  }

  static getPrime(lo, hi) {
    const sivies = [];
    const primes = [];
    for (let i = 2; i <= hi; i++) {
      if (!sivies[i]) {
        primes.push(i);
        for (let j = i * 2; j <= hi; j += i) {
          sivies[j] = true;
        }
      }
    }
    return primes[Math.floor(Math.random() * primes.length)];
  }

  static isPrime(n) {
    for (let i = 2; i < n; i++) {
      if (i % n === 0) {
        return false;
      }
    }
    return true;
  }

  static bucketSort(array, bucketSize = 1) {
    const min = array.reduce((pred, curr) => (pred > curr ? curr : pred));
    const max = array.reduce((pred, curr) => (pred < curr ? curr : pred));

    const hash = x => Math.floor(x - min) / bucketSize;
    const bucketCount = Math.floor((max - min) / bucketSize) + 1;
    const buckets = new Array(bucketCount);

    for (let i = 0; i < bucketCount; i++) {
      buckets[i] = [];
    }

    for (let i = 0; i < array.length; i++) {
      const bucketIndex = hash(array[i]);
      buckets[bucketIndex].push(array[i]);
    }

    return buckets.reduce((output, bucket) => {
      HashTable.insertionSort(bucket);
      return output.concat(bucket);
    }, []);
  }

  static insertionSort(array) {
    for (let i = 1; i < array.length; i++) {
      const temp = array[i - 1];
      let j = i;
      while (j > 0 && array[j] > temp) {
        array[j] = array[j - 1];
        j--;
      }
      array[j] = temp;
    }
  }

  static maxGap(array) {
    // hash = (x - lo) * (n - 1) / (hi - lo) = (x - lo) / w
  }

  static countSortBySignificantDigit(array, exponent, radix, min) {
    const buckets = Array(radix).fill(0);
    const output = [];
    const hash = x => Math.floor(((x - min) / exponent) % radix);

    for (let i = 0; i < array.length; i++) {
      const bucketIndex = hash(array[i]);
      buckets[bucketIndex]++;
    }

    for (let i = 1; i < radix; i++) {
      buckets[i] += buckets[i - 1];
    }

    for (let i = array.length - 1; i >= 0; i--) {
      const bucketIndex = hash(array[i]);
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
