import { expect } from 'chai';
import List from '../src/list'

describe('List', function () {
  describe('init', function () {
    it('should have not element', function () {
      var list = new List();
      expect(list.size()).to.equal(0);
    });
  });
  
  describe('copy constructor', function () {
    it('should copy from array', function () {
      var list = new List([3, 6, 0]);
      expect(list.size()).to.equal(3);
    });
  });

  describe('clear', function () {
    it('should clear the list', function () {
      var list = new List([3, 3, 3]);
      list.clear();
      expect(list.size()).to.equal(0);
    });
  });

  describe('empty', function () {
    it('should not empty', function () {
      var list = new List([1]);
      expect(list.empty()).to.be.false;
    });
  });

  describe('getter', function () {
    it('should get by position', function () {
      var list = new List([1, 3, 9]);
      expect(list.get(2)).to.equal(9);
    });
  });

  describe('first', function () {
    it('should get first element', function () {
      var list = new List([1, 2, 3]);
      expect(list.first().data).to.equal(1);
    });
  });

  describe('last', function () {
    it('should get last element', function () {
      var list = new List([2, 1, 3]);
      expect(list.last().data).to.equal(3);
    });
  });

  describe('disordered', function () {
    it('should 2 when have 2 pair revserse adjecent', function () {
      var list = new List([12, 1, 15, 2]);
      expect(list.disordered()).to.equal(2);
    });
  });

  describe('find', function () {
    it('should return null when not found', function () {
      var list = new List([1, 2, 3]);
      expect(list.find(0)).to.be.null;
    });

    it('should return lasted p when duplicate', function () {
      var list = new List([1, 2, 2, 3]);
      expect(list.find(2).succ.data).to.equal(3);
    });
  });

  describe('search', function () {
    it('should return lastest element fullfill p <= e', function () {
      var list = new List([0, 3, 5, 7, 9]);
      var p = list.search(4);
      expect(p.data).to.equal(3);
      expect(list.valid(p)).to.be.true;
    });
  });

  describe('selectMax', function () {
    it('should return max', function () {
      var list = new List([1, 2, 3]);
      expect(list.selectMax().data).to.equal(3);
    });
  });

  describe('insertAsFirst', function () {
    it('should insert at first', function () {
      var list = new List([0, 1]);
      list.insertAsFirst(8);
      expect(list.toArray()).to.eql([8, 0, 1]);
    });
  });

  describe('insertAsLast', function () {
    it('should insert at last', function () {
      var list = new List([1, 9]);
      list.insertAsLast(7);
      expect(list.toArray()).to.eql([1, 9, 7]);
    });
  });

  describe('insertA', function () {
    it('should insert after p', function () {
      var list = new List([1]);
      list.insertA(list.first(), 2);
      expect(list.toArray()).to.eql([1, 2]);   
    });
  });

  describe('insertB', function () {
    it('should insert before', function () {
      var list = new List([8, 0]);
      list.insertB(list.last(), 3);
      expect(list.toArray()).to.eql([8, 3, 0]);
    });
  });

  describe('remove', function () {
    it('should remove first element', function () {
      var list = new List([1, 2, 3]);
      list.remove(list.first());
      expect(list.toArray()).to.eql([2, 3]);
    });
  });

  describe('deduplicate', function () {
    it('should remove reduplicate element', function () {
      var list = new List([1, 2, 3, 3, 3]);
      list.deduplicate();
      expect(list.toArray()).to.eql([1, 2, 3]);
    });
  });

  describe('uniquify', function () {
    it('should remove repeated element', function () {
      var list = new List([0, 1, 2, 2, 3]);
      list.uniquify();
      expect(list.toArray()).to.eql([0, 1, 2, 3]);
    });
  });

  describe('reverse', function () {
    it('should reverse the list', function () {
      var list = new List([1, 2, 3]);
      list.reverse();
      expect(list.toArray()).to.eql([3, 2, 1]);
    });

    it('should reverse the list by swap reference', function () {
      var list = new List([1, 2, 3]);
      list.reverse2();
      expect(list.toArray()).to.eql([3, 2, 1]);
    });
  });

  describe('insertionSort', function () {
    it('should become sorted', function () {
      var list = new List([8, 0, 5, 2, 1]);
      list.insertionSort(list.first(), list.size());
      expect(list.toArray()).to.eql([0, 1, 2, 5, 8]);
    });
  });

  describe('selectionSort', function () {
    it('should become sorted', function () {
      var list = new List([4, 3, 0]);
      list.selectionSort(list.first(), list.size());
      expect(list.toArray()).to.eql([0, 3, 4]);
    });
  });

  describe('mergeSort', function () {
    it('should become sorted', function () {
      var list = new List([12, 9, 2, 10, 3]);
      list.mergeSort(list.first(), list.size());
      expect(list.toArray()).to.eql([2, 3, 9, 10, 12]);
    });
  });
});