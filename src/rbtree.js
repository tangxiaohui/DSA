import BST from './bst';
import * as BT from './binary_tree';

// babel transform plugin has bug in desctructing assignment
const RB_BLACK = BT.RB_BALCK;
const RB_RED = BT.RB_RED;
const BinNode = BT.BinNode;
const BinTree = BT.BinTree;

class RBTree extends BST {
  insert(e) {
    let x = this.search(e);
    if (x) {
      return x;
    }
    if (!this.hot) {
      x = this.insertAsRoot(e);
    } else if (e < this.hot.data) {
      x = this.insertAsLC(this.hot, e);
    } else {
      x = this.insertAsRC(this.hot, e);
    }
    this.solveDoubleRed(x);
    return x || this.hot.parent;
  }

  remove(e) {
    const x = this.search(e);
    if (!x) {
      return false;
    }
    const r = this.removeAt(x);
    if (!(--this.size)) {
      return true;
    }
    if (!x.parent) { // remove root
      this.root.color = RB_BLACK;
      RBTree.updateHeight(this.root);
      return true;
    }
    if (RBTree.blackHeightUpdated(this.hot)) {
      return true;
    }
    if (RBTree.isRed(r)) {
      r.color = RB_BLACK;
      r.height++;
      return true;
    }
    this.solveDoubleBlack(r);
    return true;
  }

  solveDoubleRed(x) {
    if (BinNode.isRoot(x)) {
      this.root.color = RB_BLACK;
      this.root.height++;
      return;
    }
    const p = x.parent;
    if (RBTree.isBlack(p)) {
      return;
    }
    const g = p && p.parent;
    const u = BinNode.uncle(x);
    if (RBTree.isBlack(u)) {
      if (BinNode.isLChild(x) === BinNode.isLChild(p)) {
        p.color = RB_BLACK;
      } else {
        console.log('render x to black');
        x.color = RB_BLACK;
      }
      g.color = RB_RED;
      this.rotateAt(x);
    } else {
      p.color = RB_BLACK;
      p.height++;
      u.color = RB_BLACK;
      u.height++;
      if (!BinNode.isRoot(g)) {
        g.color = RB_RED;
      }
      this.solveDoubleRed(g);
    }
  }

  solveDoubleBlack(r) {
    const p = r ? r.parent : this.hot;
    if (!p) {
      return;
    }
    const s = (r === p.lc) ? p.rc : p.lc; // sibling of r
    if (RBTree.isBlack(s)) {
      let t = null;
      if (RBTree.isRed(s.rc)) {
        t = s.rc;
      }
      if (RBTree.isRed(s.lc)) {
        t = s.lc;
      }
      if (t) { // BB-1
        const oldColor = p.color;
        const b = this.rotateAt(t);
        if (BinNode.hasLChild(b)) {
          b.lc.color = RB_BLACK;
          RBTree.updateHeight(b.lc);
        }
        if (BinNode.hasRChild(b)) {
          b.rc.color = RB_RED;
          RBTree.updateHeight(b.rc);
        }
        b.color = oldColor;
        RBTree.updateHeight(b);
      } else {
        s.color = RB_RED;
        s.height--;
        if (RBTree.isRed(p)) {  // BB-2-R
          p.color = RB_BLACK;
        } else { // BB-2-B
          p.height--;
          this.solveDoubleBlack(p);
        }
      }
    } else { // BB-3
      s.color = RB_BLACK;
      p.color = RB_RED;
      const t = BinNode.isLChild(s) ? s.lc : s.rc; // s must have lc and rc to rotate
      this.hot = p;
      this.rotateAt(t);
      this.solveDoubleBlack(r);
    }
  }

  static isBlack(p) {
    return (!p || RB_BLACK === p.color);
  }

  static isRed(p) {
    return !RBTree.isBlack(p);
  }

  static blackHeightUpdated(x) {
    if (BinNode.stature(x.lc) === BinNode.stature(x.rc)) {
      if ((RBTree.isRed(x))) {
        return x.height === BinNode.stature(x.lc);
      } else {
        return x.height === BinNode.stature(x.lc) + 1;
      }
    }
    return false;
  }

  static updateHeight(x) {
    x.height = Math.max(BinNode.stature(x.lc), BinNode.stature(x.rc));
    return RBTree.isBlack(x) ? x.height++ : x.height;
  }
}

export default RBTree;
