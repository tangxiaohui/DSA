import { BitMap, HashTable } from '../src/hashtable';
import { expect } from 'chai';

describe('HashTable', () => {
  describe('size', () => {

  });

  describe('put', () => {

  });

  describe('probe4Hit', () => {

  });

  describe('get', () => {

  });

  describe('probe4Free', () => {

  });

  describe('remove', () => {

  });

  describe('lazilyRemoved', () => {

  });

  describe('markAsRemoved', () => {

  });

  describe('rehash', () => {

  });

  describe('hashCode', () => {

  });

  describe('getPrime', () => {
    const prime = HashTable.getPrime(1, 100);
    let isPrime = true;
    for (let i = 1; i < prime; i++) {
      if (prime % i === 0) {
        isPrime = false;
      }
    }
    expect(isPrime).to.be.true;
  });

  describe('bucketSort', () => {

  });

  describe('radixSort', () => {

  });
})