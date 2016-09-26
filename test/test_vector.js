var expect = require('chai').expect;
var Vector = require('../src/vector');;

describe('Vector', function () {
  describe('getter', function () {
    it('should get by rank', function () {
      var vector = new Vector([0, 1, 2]);
      var value = vector.get(2);
      expect(value).to.equal(2);
    });
  });

  describe('setter', function () {
    it('should set by rank', function () {
      var vector = new Vector([]);
      vector.set(0, 2);
      expect(vector.get(0)).to.equal(2);
    });
  });

  describe('bubbleSort', function () {
    it('should become sorted', function () {
      var vector = new Vector([10, 2, 4, 19, 7]);
      vector.bubbleSort(0, vector.size());
      expect(vector.disordered()).to.equal(0);
    });
  });

  describe('selectionSort', function () {
    it('should become sorted', function () {
      var vector = new Vector([8, 5, 7, 1]);
      vector.selectionSort(0, vector.size());
      expect(vector.disordered()).to.equal(0);
    });
  });

  describe('mergeSort', function () {
    it('should become sorted', function () {
      var vectorA = new Vector([9, 8, 3, 0]);
      var vectorB = new Vector([8, 1, 0]);
      var vectorC = new Vector([0]);
      vectorA.mergeSort(0, vectorA.size());
      vectorB.mergeSort(0, vectorB.size());
      vectorC.mergeSort(0, vectorC.size());
      expect(vectorA.disordered()).to.equal(0);
      expect(vectorB.disordered()).to.equal(0);
      expect(vectorC.disordered()).to.equal(0);
    });
  });

  describe('empty', function () {
    it('should get true when empty', function () {
      var vector = new Vector([]);
      expect(vector.empty()).to.equal(true);
    });

    it('should get false when not empty', function () {
      var vector = new Vector([1, 2, 3]);
      expect(vector.empty()).to.equal(false);
    });
  });

  describe('disordered', function () {
    it('should get 2 with 2 pair adjacent reverse element', function () {
      var vector = new Vector([1, 0, 5, 4]);
      expect(vector.disordered()).to.equal(2);
    });
  });

  describe('find', function () {
    it('should return -1 when not exist', function () {
      var vector = new Vector([1, 2, 3]);
      expect(vector.find(0)).to.equal(-1);
    });

    it('should return lastest rank when found', function () {
      var vector = new Vector([1, 3, 5, 5, 7]);
      expect(vector.find(5)).to.equal(3);
    });
  });

  describe('search', function () {
    it('should return -1 not found and small than a[0]', function () {
      var vector = new Vector([9, 10 ,12]);
      expect(vector.search(8)).to.equal(-1);
    });

    it('should return lastest index when found', function () {
      var vector = new Vector([9, 10, 10, 11, 12]);
      expect(vector.search(10)).to.equal(2);
    });
  });

  describe('remove', function () {
    it('should remove element by index', function () {
      var vector = new Vector([1, 3, 5]);
      vector.remove(0);
      expect(vector.find(1)).to.equal(-1);
      expect(vector.size()).to.equal(2);
    });
  });

  describe('insert', function () {
    it('should insert element with index', function () {
      var vector = new Vector([1, 3, 5]);
      vector.insert(1, 2);
      expect(vector.find(2)).to.equal(1);
      expect(vector.size()).to.equal(4);
    });

    it('should insert at last without index', function () {
      var vector = new Vector([1]);
      vector.insert(0);
      expect(vector.get(1)).to.equal(0);
    });
  });

  describe('unsort', function () {
    it('should make the sorted to unsort', function () {
      var vector = new Vector([1, 4, 9, 10]);
      vector.unsort();
      expect(vector.disordered()).to.be.above(0);
    });
  });

  describe('deduplicate', function () {
    it('should remove equal element', function () {
      var vector = new Vector([1, 2, 3, 3, 3]);
      expect(vector.deduplicate()).to.equal(2);
    });
  });

  describe('uniquify', function () {
    it('should remove equal element', function () {
      var vector = new Vector([3, 3, 3]);
      expect(vector.uniquify()).to.equal(2);
    });
  });

  describe('traverse', function () {
    it('should pass element to callback in sequence', function () {
      var vector = new Vector([1, 2, 3]);
      var temp = [];
      vector.traverse(function (e) {
        temp.push(e);
      });
      expect(temp).to.eql([1, 2, 3]);
    });
  });
});