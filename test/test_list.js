import { expect } from 'chai';
import { List } from '../src/list';

describe('List', () => {
  describe('init', () => {
    it('should have not element', () => {
      const list = new List();
      expect(list.size).to.equal(0);
    });
  });

  describe('copy constructor', () => {
    it('should copy from array', () => {
      const list = new List([3, 6, 0]);
      expect(list.size).to.equal(3);
    });
  });

  describe('clear', () => {
    it('should clear the list', () => {
      const list = new List([3, 3, 3]);
      expect(list.toArray()).to.eql([3, 3, 3]);
      list.clear();

      expect(list.size).to.equal(0);
    });
  });

  describe('empty', () => {
    it('should not empty', () => {
      const list = new List([1]);
      expect(list.empty()).to.be.false;
    });
  });

  describe('getter', () => {
    it('should get by position', () => {
      const list = new List([1, 3, 9]);
      expect(list.get(2)).to.equal(9);
    });
  });

  describe('first', () => {
    it('should get first element', () => {
      const list = new List([1, 2, 3]);
      expect(list.first().data).to.equal(1);
    });
  });

  describe('last', () => {
    it('should get last element', () => {
      const list = new List([2, 1, 3]);
      expect(list.last().data).to.equal(3);
    });
  });

  describe('disordered', () => {
    it('should 2 when have 2 pair revserse adjecent', () => {
      const list = new List([12, 1, 15, 2]);
      expect(list.disordered()).to.equal(2);
    });
  });

  describe('find', () => {
    it('should return null when not found', () => {
      const list = new List([1, 2, 3]);
      expect(list.find(0)).to.be.null;
    });

    it('should return lasted p when duplicate', () => {
      const list = new List([1, 2, 2, 3]);
      expect(list.find(2).succ.data).to.equal(3);
    });
  });

  describe('search', () => {
    it('should return lastest element fullfill p <= e', () => {
      const list = new List([0, 3, 5, 7, 9]);
      const p = list.search(4);
      expect(p.data).to.equal(3);
      expect(list.valid(p)).to.be.true;
    });
  });

  describe('selectMax', () => {
    it('should return max', () => {
      const list = new List([1, 2, 3]);
      expect(list.selectMax().data).to.equal(3);
    });
  });

  describe('insertAsFirst', () => {
    it('should insert at first', () => {
      const list = new List([0, 1]);
      list.insertAsFirst(8);
      expect(list.toArray()).to.eql([8, 0, 1]);
    });
  });

  describe('insertAsLast', () => {
    it('should insert at last', () => {
      const list = new List([1, 9]);
      list.insertAsLast(7);
      expect(list.toArray()).to.eql([1, 9, 7]);
    });
  });

  describe('insertA', () => {
    it('should insert after p', () => {
      const list = new List([1]);
      list.insertA(list.first(), 2);
      expect(list.toArray()).to.eql([1, 2]);
    });
  });

  describe('insertB', () => {
    it('should insert before', () => {
      const list = new List([8, 0]);
      list.insertB(list.last(), 3);
      expect(list.toArray()).to.eql([8, 3, 0]);
    });
  });

  describe('remove', () => {
    it('should remove first element', () => {
      const list = new List([1, 2, 3]);
      list.remove(list.first());
      expect(list.toArray()).to.eql([2, 3]);
    });
  });

  describe('deduplicate', () => {
    it('should remove reduplicate element', () => {
      const list = new List([1, 2, 3, 3, 3]);
      list.deduplicate();
      expect(list.toArray()).to.eql([1, 2, 3]);
    });
  });

  describe('uniquify', () => {
    it('should remove repeated element', () => {
      const list = new List([0, 1, 2, 2, 3]);
      list.uniquify();
      expect(list.toArray()).to.eql([0, 1, 2, 3]);
    });
  });

  describe('reverse', () => {
    it('should reverse the list', () => {
      const list = new List([1, 2, 3]);
      list.reverse();
      expect(list.toArray()).to.eql([3, 2, 1]);
    });

    it('should reverse the list by swap reference', () => {
      const list = new List([1, 2, 3]);
      list.reverse2();
      expect(list.toArray()).to.eql([3, 2, 1]);
    });
  });

  describe('insertionSort', () => {
    it('should become sorted', () => {
      const list = new List([8, 0, 5, 2, 1]);
      list.insertionSort(list.first(), list.size);
      expect(list.toArray()).to.eql([0, 1, 2, 5, 8]);
    });
  });

  describe('selectionSort', () => {
    it('should become sorted', () => {
      const list = new List([4, 3, 0]);
      list.selectionSort(list.first(), list.size);
      expect(list.toArray()).to.eql([0, 3, 4]);
    });
  });

  describe('mergeSort', () => {
    it('should become sorted', () => {
      const list = new List([12, 9, 2, 10, 3]);
      list.mergeSort(list.first(), list.size);
      expect(list.toArray()).to.eql([2, 3, 9, 10, 12]);
    });
  });
});
