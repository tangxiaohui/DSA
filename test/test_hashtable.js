import { BitMap, HashTable } from '../src/hashtable';
import { expect } from 'chai';

describe('HashTable', () => {
  describe('size', () => {
    it('should return element count in hashtable', () => {
      const ht = new HashTable();
      ht.put(1, 'foo');
      expect(ht.size()).to.equal(1);
    });
  });

  describe('capacity', () => {
    it('should return capacity of hashtable and it should be a prime number', () => {
      const ht = new HashTable();
      expect(ht.capacity()).to.be.above(1);
      expect(HashTable.isPrime(ht.capacity())).to.be.true;
    });
  });

  describe('put', () => {
    it('should return true when put success', () => {
      const ht = new HashTable();
      expect(ht.put(1, 'foo')).to.be.true;
    });

    it('should return false when put same key entry', () => {
      const ht = new HashTable();
      expect(ht.put(1, 'foo')).to.be.true;
      expect(ht.put(1, 'foo')).to.be.false;
    });
  });

  describe('probe4Hit', () => {
    it('should return rank of the entry when hit', () => {
      const ht = new HashTable();
      ht.put(1, 'foo');
      ht.put(2, 'bar');
      const r = ht.probe4Hit(2);
      expect(ht.indexOf(r).value).to.equal('bar');
    });

    it('should return rand of null when key not exist', () => {
      const ht = new HashTable();
      ht.put(1, 'foo');
      const r = ht.probe4Hit(2);
      expect(ht.indexOf(r)).to.be.null;
    });
  });

  describe('get', () => {
    it('should return value of entry when key exist', () => {
      const ht = new HashTable();
      ht.put(1, 'foo');
      expect(ht.get(1)).to.equal('foo');
    });

    it('should return null when key not exist', () => {
      const ht = new HashTable(7);
      ht.put(1, 'foo');
      expect(ht.get(2)).to.be.null;
    });
  });

  describe('probe4Free', () => {
    it('should return rank to empty solt', () => {
      const ht = new HashTable();
      ht.put(1, 'foo');
      const r = ht.probe4Free(1);
      expect(ht.indexOf(r)).to.be.null;
    });
  });

  describe('remove', () => {
    it('should return true when key exist and remove success', () => {
      const ht = new HashTable();
      ht.put(1, 'foo');
      expect(ht.remove(1)).to.be.true;
      expect(ht.get(1)).to.be.null;
    });

    it('should return false when key not exist and remove fail', () => {
      const ht = new HashTable();
      expect(ht.remove(1)).to.be.false;
    });
  });

  describe('lazilyRemoved', () => {
    it('should return lazyRemoved mark', () => {
      const ht = new HashTable();
      ht.put(1, 'foo');
      ht.remove(1);
      expect(ht.lazilyRemoved(1)).to.be.true;
      expect(ht.lazilyRemoved(0)).to.be.false;
    });
  });

  describe('markAsRemoved', () => {
    it('should mark the solt as lazyRemoved', () => {
      const ht = new HashTable(7);
      ht.markAsRemoved(0);
      expect(ht.lazilyRemoved(0)).to.be.true;
    });
  });

  describe('rehash', () => {
    it('should expand capacity to double', () => {
      const ht = new HashTable();
      const oldCapacity = ht.capacity();
      ht.rehash();
      expect(ht.capacity()).to.satisfy((n) => n === 2 * oldCapacity);
    });
  });

  describe('hashCode', () => {
    it('should return origin when argument is Number', () => {
      expect(HashTable.hashCode(2)).to.equal(2);
    });

    it('should return hash result when argument is String', () => {
      expect(HashTable.hashCode('foo')).to.equal(114852);
    });
  });

  describe('getPrime', () => {
    const prime = HashTable.getPrime(1, 100);
    expect(HashTable.isPrime(prime)).to.be.true;
  });

  describe('bucketSort', () => {
    const arr = [4, 9, 28, 1, 22];
    expect(HashTable.bucketSort(arr)).to.eql([1, 4, 9, 22, 28]);
  });

  describe('radixSort', () => {
    const arr = [0, 78, 56, 19, 20, 100];
    expect(HashTable.radixSort(arr)).to.eql([0, 19, 20, 56, 78, 100]);
  });
});
