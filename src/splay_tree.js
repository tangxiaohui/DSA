import BST from './bst';
import { BinNode, BinTree } from './binary_tree';

const attachAsLChild = BinNode.attachAsLChild;
const attachAsRChild = BinNode.attachAsRChild;

class Splay extends BST {
  search(e) {
    const p = this.searchIn(this.root, e);
    this.root = Splay.splay(p || this.hot);
    return this.root;
  }

  insert(e) {
    if (!this.root) {
      return this.insertAsRoot(e);
    }
    if (e === this.search(e).data) {
      return this.root;
    }
    this.size++;
    const t = this.root;
    if (this.root.data < e) {
      t.parent = this.root = new BinNode(e, null, t, t.rc);
      if (BinNode.hasRChild(t)) {
        t.rc.parent = this.root;
        t.rc = null;
      }
    } else {
      t.parent = this.root = new BinNode(e, null, t.lc, t);
      if (BinNode.hasLChild(t)) {
        t.lc.parent = this.root;
        t.lc = null;
      }
    }
    BinTree.updateHeightAbove(t);
    return this.root;
  }

  remove(e) {
    if (!this.root || (e !== this.search(e).data)) {
      return false;
    }
    const w = this.root;
    if (!BinNode.hasLChild(this.root)) {
      this.root = this.root.rc;
      if (this.root) {
        this.root.parent = null;
      }
    } else if (!BinNode.hasRChild(this.root)) {
      this.root = this.root.lc;
      if (this.root) {
        this.root.parent = null;
      }
    } else {
      const lTree = this.root.lc;
      lTree.parent = null;
      this.root.lc = null;
      this.root = this.root.rc;
      this.root.parent = null;
      this.search(w.data);
      this.root.lc = lTree;
      lTree.parent = this.root;
    }
    this.size--;
    if (this.root) {
      BinTree.updateHeight(this.root);
    }
    return true;
  }

  static splay(v) {
    if (!v) {
      return null;
    }

    let p = v.parent;
    let g = p && p.parent;
    while (p && g) {
      const gg = g.parent;
      if (BinNode.isLChild(v)) {
        if (BinNode.isLChild(p)) {
          attachAsLChild(g, p.rc);
          attachAsLChild(p, v.rc);
          attachAsRChild(p, g);
          attachAsRChild(v, p);
        } else {
          attachAsLChild(p, v.rc);
          attachAsRChild(g, v.lc);
          attachAsLChild(v, g);
          attachAsRChild(v, p);
        }
      } else if (BinNode.isRChild(p)) {
        attachAsRChild(g, p.lc);
        attachAsRChild(p, v.lc);
        attachAsLChild(p, g);
        attachAsLChild(v, p);
      } else {
        attachAsRChild(p, v.lc);
        attachAsLChild(g, v.rc);
        attachAsRChild(v, g);
        attachAsLChild(v, p);
      }
      if (!gg) {
        v.parent = null;
      } else {
        (g === g.lc) ? attachAsLChild(gg, v) : attachAsRChild(gg, v);
      }
      BinTree.updateHeight(g);
      BinTree.updateHeight(p);
      BinTree.updateHeight(v);
      p = v.parent;
      g = p && p.parent;
    }
    p = v.parent;
    if (p) {
      if (BinNode.isLChild(v)) {
        attachAsLChild(p, v.rc);
        attachAsRChild(v, p);
      } else {
        attachAsRChild(p, v.lc);
        attachAsLChild(v, p);
      }
      BinTree.updateHeight(p);
      BinTree.updateHeight(v);
    }
    v.parent = null;
    return v;
  }
}

export default Splay;
