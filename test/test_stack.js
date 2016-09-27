import { expect } from 'chai';
import Stack from '../src/stack';

const convert = (S, n, base) => {
  const digit = '0123456789ABCDEF'.split('');
  while (n > 0) {
    const reminder = (n % base);
    S.push(digit[reminder]);
    console.log(n);
    n /= base;
  }
};

describe('Stack', () => {
  it('should covert the number base', () => {
    const s = new Stack();
    convert(s, 10, 16);
    let str = '';
  });
});
