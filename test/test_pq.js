import { expect } from 'chai';
import { CompleteHeap } from '../src/priority_queue';

describe('Priority Queue', () => {
  describe('CompleteHeap', () => {
    describe('getMax', () => {
      it('should return max on the heap', () => {
        const heap = new CompleteHeap([2, 3, 1]);
        expect(heap.getMax()).to.equal(3);
      });
    });

    describe('delMax', () => {
      it('should delete max on the heap and set secondary as max', () => {
        const heap = new CompleteHeap([2, 3, 1]);
        expect(heap.delMax()).to.equal(3);
        expect(heap.getMax()).to.equal(2);
      });
    });


    describe('insert', () => {
      it('should insert element and move the max to the top', () => {
        const heap = new CompleteHeap();
        heap.insert(0);
        heap.insert(9);
        expect(heap.size()).to.equal(2);
        expect(heap.getMax()).to.equal(9);
      });
    });

    describe('percolateUp', () => {
      it('should percolate up element to proper place when it greater that parent', () => {
        const heap = new CompleteHeap([1, 2, 3]);
        heap.set(heap.size(), 4);
        heap.percolateUp(heap.size() - 1);
        expect(heap.getMax()).to.equal(4);
      });
    });

    describe('percolateDown', () => {
      it('should percolate down element to proper place when it small that child', () => {
        const heap = new CompleteHeap([7, 8, 9]);
        heap.set(0, 1);
        heap.percolateDown(heap.size(), 0);
        expect(heap.get(0)).to.not.equal(1);
      });
    });

    describe('inHeap', () => {
      it('should return false when i <= -1 or i >= n', () => {
        const heap = new CompleteHeap([1, 2, 3]);
        expect(CompleteHeap.inHeap(heap.size(), -1)).to.be.false;
        expect(CompleteHeap.inHeap(heap.size(), heap.size())).to.be.false;
      });

      it('should return true when -1 < i < n', () => {
        const heap = new CompleteHeap([1, 2, 3]);
        expect(CompleteHeap.inHeap(heap.size(), 0)).to.be.true;
      });
    });

    describe('parent', () => {
      it('should return parent rank', () => {
        const heap = new CompleteHeap([1, 2, 3]);
        expect(CompleteHeap.parent(1)).to.equal(0);
        expect(CompleteHeap.parent(2)).to.equal(0);
      });
    });

    describe('lastInternal', () => {
      it('should return last internal node', () => {
        const heap = new CompleteHeap([1, 2, 3, 4, 5, 6, 7]);
        expect(CompleteHeap.lastInernal(heap.size())).to.equal(2);
      });
    });

    describe('leftChild', () => {
      it('should return rank of left child', () => {
        for (let i = 0; i < 3; i++) {
          expect(CompleteHeap.leftChild(i)).to.equal((i << 1) + 1);
        }
      });
    });

    describe('rightChild', () => {
      it('should return rank of right child', () => {
        for (let i = 0; i < 3; i++) {
          expect(CompleteHeap.rightChild(i)).equal((i + 1) << 1);
        }
      });
    });

    describe('leftChildValid', () => {
      it('should return true when left child is in heap', () => {
        for (let i = 0; i < 3; i++) {
          expect(CompleteHeap.leftChildValid(7, i)).to.be.true;
        }
      });

      it('should return false when left child is not in heap', () => {
        for (let i = 4; i < 7; i++) {
          expect(CompleteHeap.leftChildValid(7, i)).to.be.false;
        }
      });
    });

    describe('rightChildValid', () => {
      it('should return true when right child in heap', () => {
        for (let i = 0; i < 3; i++) {
          expect(CompleteHeap.leftChildValid(7, i)).to.be.true;
        }
      });

      it('should return false when right child is not in heap', () => {
        for (let i = 4; i < 7; i++) {
          expect(CompleteHeap.leftChildValid(7, i)).to.be.false;
        }
      });
    });

    describe('bigger', () => {
      it('should return rand of bigger one in array', () => {
        const array = [1, 2];
        expect(CompleteHeap.bigger(array, 0, 1)).to.equal(1);
      });
    });

    describe('properParent', () => {
      it('should return rand of biggest one between parent, leftChild and rightChild', () => {
        const testProperParent = (pq, biggest) => {
          expect(CompleteHeap.properParent(pq, pq.length, 0)).to.equal(biggest);
        };
        testProperParent([1, 2, 3], 2);
        testProperParent([1, 3, 2], 1);
        testProperParent([3, 2, 1], 0);
      });
    });
  });
});

