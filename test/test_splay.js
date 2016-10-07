import Splay from '../src/splay_tree';
import { BinNode } from '../src/binary_tree';
import { expect } from 'chai';

const attachAsLChild = BinNode.attachAsLChild;
const attachAsRChild = BinNode.attachAsRChild;

describe('Splay Tree', () => {
  describe('search', () => {
    it('should shift the element to the root when found', () => {
      const tree = new Splay();
      tree.insert(7);
      tree.insert(6);
      tree.insert(5);
      expect(tree.search(7).data).to.equal(7);
      expect(tree.root.data).to.equal(7);
    });

    it('should shift the latest reach element to root when not found', () => {
      const tree = new Splay();
      tree.insert(7);
      tree.insert(6);
      tree.insert(5);
      expect(tree.search(8).data).to.equal(7);
      expect(tree.root.data).to.equal(7);
      expect(tree.search(4).data).to.equal(5);
      expect(tree.root.data).to.equal(5);
    });
  });

  describe('insert', () => {
    it('should shift the insert element to root', () => {
      const tree = new Splay();
      tree.insert(7);
      tree.insert(6);
      tree.insert(5);
      expect(tree.root.data).to.equal(5);
      expect(tree.root.height).to.equal(2);
    });

    it('should insert as root if empty', () => {
      const tree = new Splay();
      const root = tree.insert(9);
      expect(tree.root).eql(root);
      expect(root.data).to.equal(9);
    });

    it('should not insert if exists', () => {
      const tree = new Splay();
      tree.insert(9);
      tree.insert(8);
      tree.insert(7);
      tree.insert(7);
      expect(tree.size).to.equal(3);
    });

    it('should build right alone branch', () => {
      const tree = new Splay();
      tree.insert(9);
      tree.insert(8);
      tree.insert(7);
      expect(tree.root.data).to.equal(7);
      expect(tree.root.rc.data).to.equal(8);
      expect(tree.root.rc.rc.data).to.equal(9);
    });

    it('should build left alone branch', () => {
      const tree = new Splay();
      tree.insert(5);
      tree.insert(6);
      tree.insert(7);
      expect(tree.root.data).to.equal(7);
      expect(tree.root.lc.data).to.equal(6);
      expect(tree.root.lc.lc.data).to.equal(5);
    });
  });

  describe('remove', () => {
    it('should return false if tree is empty', () => {
      const tree = new Splay();
      expect(tree.remove(1)).to.be.false;
    });

    it('should return false if target not exist', () => {
      const tree = new Splay();
      tree.insert(9);
      expect(tree.remove(0)).to.be.false;
    });

    it('should replace with left child if no right child', () => {
      const tree = new Splay();
      tree.insert(5);
      tree.insert(6);
      tree.insert(7);
      expect(tree.root.data).to.equal(7);
      expect(tree.root.lc.data).to.equal(6);
      expect(tree.root.rc).to.be.null;
      tree.remove(7);
      expect(tree.root.data).to.equal(6);
    });

    it('should replace with right child if no left child', () => {
      const tree = new Splay();
      tree.insert(7);
      tree.insert(6);
      tree.insert(5);
      expect(tree.root.data).to.equal(5);
      expect(tree.root.rc.data).to.equal(6);
      expect(tree.root.lc).to.be.null;
      tree.remove(5);
      expect(tree.root.data).to.equal(6);
    });

    it('should replace the smallest one in right child as root', () => {
      const tree = new Splay();
      tree.insert(6);
      tree.insert(7);
      tree.insert(8);
      tree.insert(3);
      tree.insert(4);
      tree.insert(5);
      expect(tree.root.data).to.equal(5);
      expect(tree.remove(5)).to.be.true;
      expect(tree.root.data).to.equal(6);
    });
  });

  describe('attachAsRChild', () => {
    it('should attach b as left child of a', () => {
      const a = new BinNode(1);
      const b = new BinNode(2);
      attachAsLChild(a, b);
      expect(a.lc).to.eql(b);
      expect(b.parent).to.eql(a);
    });
  });

  describe('attachAsRChild', () => {
    it('should attach b as right child of a', () => {      
      const a = new BinNode(1);
      const b = new BinNode(2);
      attachAsRChild(a, b);
      expect(a.rc).to.eql(b);
      expect(b.parent).to.eql(a);
    });
  });

  describe('splay', () => {
    // zig(g) zig(p)
    it('should shift v to top when g.lc == p && p.lc == v', () => {
      const g = new BinNode('g');
      const p = new BinNode('p');
      const v = new BinNode('v');
      attachAsLChild(g, p);
      attachAsLChild(p, v);
      expect(Splay.splay(v).data).to.equal('v');
      expect(v.rc.data).to.equal('p');
      expect(p.rc.data).to.equal('g');
    });

    // zag(g) zag(p)
    it('should shift v to top when g.rc == p && p.rc == v', () => {
      const g = new BinNode('g');
      const p = new BinNode('p');
      const v = new BinNode('v');
      attachAsRChild(g, p);
      attachAsRChild(p, v);
      expect(Splay.splay(v).data).to.equal('v');
      expect(v.lc.data).to.equal('p');
      expect(p.lc.data).to.equal('g');
    });

    // zig(p) zag(g)
    it('should shift v to top when g.rc == p && p.lc == v', () => {
      const g = new BinNode('g');
      const p = new BinNode('p');
      const v = new BinNode('v');
      attachAsRChild(g, p);
      attachAsLChild(p, v);
      expect(Splay.splay(v).data).to.equal('v');
      expect(v.lc.data).to.equal('g');
      expect(v.rc.data).to.equal('p');
    });

    // zag(p) zig(g)
    it('should shift v to top when g.lc == p && p.rc == v', () => {
      const g = new BinNode('g');
      const p = new BinNode('p');
      const v = new BinNode('v');
      attachAsLChild(g, p);
      attachAsRChild(p, v);
      expect(Splay.splay(v).data).to.equal('v');
      expect(v.rc.data).to.equal('g');
      expect(v.lc.data).to.equal('p');
    });

    it('should shift v to top when p.lc == v', () => {
      const p = new BinNode('p');
      const v = new BinNode('v');
      attachAsLChild(p, v);
      expect(Splay.splay(v).data).to.equal('v');
      expect(v.rc.data).to.equal('p');
    });

    it('should shift v to top when p.rc == v', () => {
      const p = new BinNode('p');
      const v = new BinNode('v');
      attachAsRChild(p, v);
      expect(Splay.splay(v).data).to.equal('v');
      expect(v.lc.data).to.eql('p');
    });
  });
});
