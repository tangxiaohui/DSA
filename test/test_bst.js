import Queue from '../src/queue';
import BST from '../src/bst';
import { BinNode } from '../src/binary_tree';
import { expect } from 'chai';

describe('BST', () => {
  describe('insert', () => {
    it('should insert as left child', () => {
      const tree = new BST();
      const root = tree.insertAsRoot(1);
      expect(tree.insert(0)).to.eql(root.lc);
    });

    it('should insert as right child', () => {
      const tree = new BST();
      const root = tree.insertAsRoot(1);
      expect(tree.insert(2)).to.eql(root.rc);
    });
  });

  describe('search', () => {
    it('should return the node when found', () => {
      const tree = new BST();
      const root = tree.insertAsRoot(0);
      const q = new Queue([root]);
      for (let i = 1; i < 6; i += 2) {
        const node = q.dequeue();
        q.enqueue(tree.insertAsLC(node, i));
        q.enqueue(tree.insertAsRC(node, i + 1));
      }
      expect(tree.search(6).data).to.equal(6);
    });

    it('should return null when not found', () => {
      const tree = new BST();
      const root = tree.insertAsRoot(0);
      const q = new Queue([root]);
      for (let i = 1; i < 6; i += 2) {
        const node = q.dequeue();
        q.enqueue(tree.insertAsLC(node, i));
        q.enqueue(tree.insertAsRC(node, i + 1));
      }
      expect(tree.search(7)).to.be.null;
    });
  });

  describe('remove', () => {
    it('should return false when element not exists', () => {
      const tree = new BST();
      expect(tree.remove(0)).to.be.false;
    });

    it('should return true when element is removed', () => {
      const tree = new BST();
      const root = tree.insertAsRoot(0);
      const q = new Queue([root]);
      for (let i = 1; i < 6; i += 2) {
        const node = q.dequeue();
        q.enqueue(tree.insertAsLC(node, i));
        q.enqueue(tree.insertAsRC(node, i + 1));
      }
      expect(tree.remove(0)).to.be.true;
      expect(tree.size).to.equal(6);
    });
  });

  describe('removeAt', () => {
    it('should return right child when no left child', () => {
      const tree = new BST();
      const root = tree.insertAsRoot(0);
      tree.insert(1);
      expect(tree.removeAt(tree.search(0)).data).to.equal(1);
    });

    it('should return left child when no right child', () => {
      const tree = new BST();
      const root = tree.insertAsRoot(1);
      tree.insert(0);
      expect(tree.removeAt(tree.search(1)).data).to.equal(0);
    });

    it('should return succ when have both right child and left child', () => {
      const tree = new BST();
      const root = tree.insertAsRoot(1);
      tree.insert(0);
      tree.insert(2);
      expect(tree.removeAt(tree.search(0))).to.be.null;
    });
  });

  describe('rotateAt', () => {
    it('should do zig(g)', () => {
      const tree = new BST();
      const g = tree.insert(5);
      const p = tree.insert(3);
      const t3 = tree.insert(6);
      const t2 = tree.insert(4);
      const v = tree.insert(1);
      const t0 = tree.insert(0);
      const t1 = tree.insert(2);
      tree.root = tree.rotateAt(v);
      const output = [];
      tree.travIn(x => output.push(x));
      expect(output).to.eql([0, 1, 2, 3, 4, 5, 6]);
    });

    it('should do zag(p) and zig(g)', () => {
      const tree = new BST();
      const g = tree.insert(5);
      const p = tree.insert(1);
      const v = tree.insert(4);
      const t0 = tree.insert(0);
      const t1 = tree.insert(2);
      const t2 = tree.insert(3);
      const t3 = tree.insert(6);
      tree.root = tree.rotateAt(v);
      const output = [];
      tree.travIn(x => output.push(x));
      expect(output).to.eql([0, 1, 2, 3, 4, 5, 6]);
    });

    it('should do zag(g)', () => {
      const tree = new BST();
      const g = tree.insert(1);
      const p = tree.insert(3);
      const v = tree.insert(4);
      const t0 = tree.insert(0);
      const t1 = tree.insert(2);
      const t2 = tree.insert(5);
      const t3 = tree.insert(6);
      tree.root = tree.rotateAt(v);
      const output = [];
      tree.travIn(x => output.push(x));
      expect(output).to.eql([0, 1, 2, 3, 4, 5, 6]);
    });

    it('should do zig(p) and zag(g)', () => {
      const tree = new BST();
      const g = tree.insert(1);
      const p = tree.insert(5);
      const v = tree.insert(3);
      const t0 = tree.insert(0);
      const t1 = tree.insert(2);
      const t2 = tree.insert(4);
      const t3 = tree.insert(6);
      tree.root = tree.rotateAt(v);
      const output = [];
      tree.travIn(x => output.push(x));
      expect(output).to.eql([0, 1, 2, 3, 4, 5, 6]);
    });
  });

  describe('connect34', () => {
    it('should build balance tree', () => {
      const a = new BinNode('a');
      const b = new BinNode('b');
      const c = new BinNode('c');
      const t0 = new BinNode('T0');
      const t1 = new BinNode('T1');
      const t2 = new BinNode('T2');
      const t3 = new BinNode('T3');
      BST.connect34(a, b, c, t0, t1, t2, t3);
      const tree = new BST(1, b);
      const output = [];
      tree.travIn(x => output.push(x));
      expect(output).to.eql(['T0', 'a', 'T1', 'b', 'T2', 'c', 'T3']);
    });
  });
});
