import { expect } from 'chai';
import Vector from '../src/vector';

describe('Vector', () => {
  describe('getter', () => {
    it('should get by rank', () => {
      const vector = new Vector([0, 1, 2]);
      const value = vector.get(2);
      expect(value).to.equal(2);
    });
  });

  describe('setter', () => {
    it('should set by rank', () => {
      const vector = new Vector([]);
      vector.set(0, 2);
      expect(vector.get(0)).to.equal(2);
    });
  });

  describe('bubbleSort', () => {
    it('should become sorted', () => {
      const vector = new Vector([10, 2, 4, 19, 7]);
      vector.bubbleSort(0, vector.size());
      expect(vector.disordered()).to.equal(0);
    });
  });

  describe('selectionSort', () => {
    it('should become sorted', () => {
      const vector = new Vector([8, 5, 7, 1]);
      vector.selectionSort(0, vector.size());
      expect(vector.disordered()).to.equal(0);
    });
  });

  describe('mergeSort', () => {
    it('should become sorted', () => {
      const vector = new Vector([9, 8, 3, 0]);
      vector.mergeSort(0, vector.size());
      expect(vector.disordered()).to.equal(0);
    });
  });

  describe('empty', () => {
    it('should get true when empty', () => {
      const vector = new Vector([]);
      expect(vector.empty()).to.equal(true);
    });

    it('should get false when not empty', () => {
      const vector = new Vector([1, 2, 3]);
      expect(vector.empty()).to.equal(false);
    });
  });

  describe('disordered', () => {
    it('should get 2 with 2 pair adjacent reverse element', () => {
      const vector = new Vector([1, 0, 5, 4]);
      expect(vector.disordered()).to.equal(2);
    });
  });

  describe('find', () => {
    it('should return -1 when not exist', () => {
      const vector = new Vector([1, 2, 3]);
      expect(vector.find(0)).to.equal(-1);
    });

    it('should return lastest rank when found', () => {
      const vector = new Vector([1, 3, 5, 5, 7]);
      expect(vector.find(5)).to.equal(3);
    });
  });

  describe('search', () => {
    it('should return -1 not found and small than a[0]', () => {
      const vector = new Vector([9, 10, 12]);
      expect(vector.search(8)).to.equal(-1);
    });

    it('should return lastest index when found', () => {
      const vector = new Vector([9, 10, 10, 11, 12]);
      expect(vector.search(10)).to.equal(2);
    });
  });

  describe('remove', () => {
    it('should remove element by index', () => {
      const vector = new Vector([1, 3, 5]);
      vector.remove(0);
      expect(vector.find(1)).to.equal(-1);
      expect(vector.size()).to.equal(2);
    });
  });

  describe('insert', () => {
    it('should insert element with index', () => {
      const vector = new Vector([1, 3, 5]);
      vector.insert(1, 2);
      expect(vector.find(2)).to.equal(1);
      expect(vector.size()).to.equal(4);
    });

    it('should insert at last without index', () => {
      const vector = new Vector([1]);
      vector.insert(0);
      expect(vector.get(1)).to.equal(0);
    });
  });

  describe('unsort', () => {
    it('should make the sorted to unsort', () => {
      const vector = new Vector([1, 4, 9, 10]);
      vector.unsort();
      expect(vector.disordered()).to.be.above(0);
    });
  });

  describe('deduplicate', () => {
    it('should remove equal element', () => {
      const vector = new Vector([1, 2, 3, 3, 3]);
      expect(vector.deduplicate()).to.equal(2);
    });
  });

  describe('uniquify', () => {
    it('should remove equal element', () => {
      const vector = new Vector([3, 3, 3]);
      expect(vector.uniquify()).to.equal(2);
    });
  });

  describe('traverse', () => {
    it('should pass element to callback in sequence', () => {
      const vector = new Vector([1, 2, 3]);
      const temp = [];
      vector.traverse((e) => {
        temp.push(e);
      });
      expect(temp).to.eql([1, 2, 3]);
    });
  });
});
