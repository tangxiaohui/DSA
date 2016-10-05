import BST from './bst';
import { BinNode, BinTree } from './binary_tree';

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

  static attachAsLChild(p, lc) {
    p.lc = lc;
    if (lc) {
      lc.parent = p;
    }
  }

  static attachAsRChild(p, rc) {
    p.rc = rc;
    if (rc) {
      rc.parent = p;
    }
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
          Splay.attachAsLChild(g, p.rc);
          Splay.attachAsLChild(p, v.rc);
          Splay.attachAsRChild(p, g);
          Splay.attachAsRChild(v, p);
        } else {
          Splay.attachAsLChild(p, v.rc);
          Splay.attachAsRChild(g, v.lc);
          Splay.attachAsLChild(v, g);
          Splay.attachAsRChild(v, p);
        }
      } else if (BinNode.isRChild(p)) {
        Splay.attachAsRChild(g, p.lc);
        Splay.attachAsRChild(p, v.lc);
        Splay.attachAsLChild(p, g);
        Splay.attachAsLChild(v, p);
      } else {
        Splay.attachAsRChild(p, v.lc);
        Splay.attachAsLChild(g, v.rc);
        Splay.attachAsRChild(v, g);
        Splay.attachAsLChild(v, p);
      }
      if (!gg) {
        v.parent = null;
      } else {
        (g === g.lc) ? Splay.attachAsLChild(gg, v) : Splay.attachAsRChild(gg, v);
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
        Splay.attachAsLChild(p, v.rc);
        Splay.attachAsRChild(v, p);
      } else {
        Splay.attachAsRChild(p, v.lc);
        Splay.attachAsLChild(v, p);
      }
      BinTree.updateHeight(p);
      BinTree.updateHeight(v);
    }
    v.parent = null;
    return v;
  }
}

export default Splay;
