import { expect } from 'chai';
import Stack from '../src/stack';

// 进制转换
const convert = (S, n, base) => {
  const digit = '0123456789ABCDEF'.split('');
  while (n > 0) {
    const reminder = (n % base);
    S.push(digit[reminder]);
    n = Math.floor(n / base);
  }
};

// 括号匹配
const paren = (exp, lo, hi) => {
  const s = new Stack();
  for (let i = lo; i < hi; i++) {
    switch (exp[i]) {
      case '(':
      case '[':
      case '{': s.push(exp[i]); break;
      case ')': if ((s.empty() || (s.pop() !== '('))) return false; break;
      case ']': if ((s.empty() || (s.pop() !== '['))) return false; break;
      case '}': if ((s.empty() || (s.pop() !== '{'))) return false; break;
      default: break;
    }
  }
  return s.empty();
};

const rpnEvaluation = (exp) => {
  const s = new Stack();
  let i = 0;
  while (i < exp.length) {
    if (!isNaN(exp[i])) {
      s.push(exp[i]);
    } else {
      const opnd1 = s.pop();
      const opnd2 = s.pop();
      switch (exp[i]) {
        case '+': s.push(parseInt(opnd1, 10) + parseInt(opnd2, 10)); break;
        case '-': s.push(parseInt(opnd1, 10) - parseInt(opnd2, 10)); break;
        case '*': s.push(parseInt(opnd1, 10) * parseInt(opnd2, 10)); break;
        case '/': s.push(parseInt(opnd1, 10) / parseInt(opnd2, 10)); break;
        default: return -1;
      }
    }
    i++;
  }
  return s.pop();
};

describe('Stack', () => {
  describe('convert', () => {
    it('should covert the number base', () => {
      const s = new Stack();
      convert(s, 10, 16);
      let str = '';
      while (s.size() > 0) {
        str += s.pop();
      }
      expect(str).to.equal('A');
    });
  });

  describe('paren', () => {
    it('should return true when the bracket is match', () => {
      const exp = '1+(2 * 3)';
      expect(paren(exp, 0, exp.length)).to.be.true;
    });

    it('should return false when the bracket is not match', () => {
      const exp = '(1 * 2 - 3';
      expect(paren(exp, 0, exp.length)).to.be.false;
    });
  });

  describe('rpn evaluation', () => {
    it('should be able to calculate the rpn expression', () => {
      const rpn = '12+3*';
      expect(rpnEvaluation(rpn)).to.equal(9);
    });
  });
});
