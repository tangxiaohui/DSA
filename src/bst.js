import { BinNode, BinTree } from './binary_tree';

class BST extends BinTree {
  constructor(size = 0, root = null) {
    super(size, root);
    this.hot = null;
  }

  search(e) {
    return this.searchIn(this.root, e);
  }

  searchIn(v, e) {
    // 返回命中的节点或者假想的通配节点
    if (!v || (e === v.data)) {
      return v;
    }
    this.hot = v;
    return this.searchIn(
      e < v.data ? v.lc : v.rc,
      e
    );
  }

  insert(e) {
    let x = this.search(e);
    if (x) {
      return x;
    }
    if (!this.hot) {
      x = this.insertAsRoot(e);
    } else if (e < this.hot.data) {
      x = this.hot.insertAsLC(e);
    } else {
      x = this.hot.insertAsRC(e);
    }
    this.size++;
    BinTree.updateHeightAbove(x);
    return x;
  }

  remove(e) {
    const x = this.search(e);
    if (!x) {
      return false;
    }
    this.removeAt(x);
    this.size--;
    BinTree.updateHeightAbove(this.hot);
    return true;
  }

  removeAt(x) {
    let w = x;
    let succ = null;
    if (!BinNode.hasLChild(x)) {
      succ = x.rc;
      this.attachToParent(x, succ);
    } else if (!BinNode.hasRChild(x)) {
      succ = x.lc;
      this.attachToParent(x, succ);
    } else { // 若左右子树均存在，则选择x的直接后继作为实际被摘除的节点
      w = w.succ();
      BST.swap(x, w);
      const u = w.parent;
      (u === x) ?
        u.rc = succ = w.rc :
        u.lc = succ = w.rc;
    }

    this.hot = w.parent;
    if (succ) {
      succ.parent = this.hot;
    }
    return succ;
  }

  static connect34(a, b, c, T0, T1, T2, T3) {
    a.lc = T0;
    if (T0) {
      T0.parent = a;
    }
    a.rc = T1;
    if (T1) {
      T1.parent = a;
    }
    BinTree.updateHeight(a);

    c.lc = T2;
    if (T2) {
      T2.parent = c;
    }
    c.rc = T3;
    if (T3) {
      T3.parent = c;
    }
    BinTree.updateHeight(c);

    b.lc = a;
    a.parent = b;
    b.rc = c;
    c.parent = b;
    BinTree.updateHeight(b);
    return b;
  }

  rotateAt(v) { // v is grand child
    const p = v.parent;
    const g = p.parent;

    if (BinNode.isLChild(p)) {
      if (BinNode.isLChild(v)) { // zig(g)
        p.parent = g.parent;
        this.attachToParent(g, p);
        return BST.connect34(v, p, g, v.lc, v.rc, p.rc, g.rc);
      } else {  // zag(p) zig(g)
        v.parent = g.parent;
        this.attachToParent(g, v);
        return BST.connect34(p, v, g, p.lc, v.lc, v.rc, g.rc);
      }
    } else {
      if (BinNode.isRChild(v)) { // zag(p)
        p.parent = g.parent;
        this.attachToParent(g, p);
        return BST.connect34(g, p, v, g.lc, p.lc, v.lc, v.rc);
      } else { // zig(p) zag(g)
        v.parent = g.parent;
        this.attachToParent(g, v);
        return BST.connect34(g, v, p, g.lc, v.lc, v.rc, p.rc);
      }
    }
  }

  attachToParent(x, child) {
    if (BinNode.isLChild(x)) {
      x.parent.lc = child;
      return x.parent.lc;
    } else if (BinNode.isRChild(x)) {
      x.parent.rc = child;
      return x.parent.rc;
    } else {
      this.root = child;
      return this.root;
    }
  }

  static swap(a, b) {
    const temp = a.data;
    a.data = b.data;
    b.data = temp;
  }
}

class AVL extends BST {
  insert(e) {
    let x = this.search(e);
    if (x) {
      return x;
    }
    if (!this.hot) {
      x = this.insertAsRoot(e);
    } else if (e < this.hot.data) {
      x = this.hot.insertAsLC(e);
    } else {
      x = this.hot.insertAsRC(e);
    }

    // this.size++; // 由于 search 返回的不是引用， 所以改用以上的插入操作。但是以上的操作已经进行了 size++, 因此这里不需要 size++

    for (let g = this.hot; g; g = g.parent) {
      if (!AVL.avlBalanced(g)) {
        const v = AVL.tallerChild(AVL.tallerChild(g));
        g = this.rotateAt(v);
      } else {
        BinTree.updateHeight(g);
      }
    }
    return x;
  }

  remove(e) {
    const x = this.search(e);
    if (!x) {
      return false;
    }
    this.removeAt(x);
    this.size--;
    for (let g = this.hot; g; g = g.parent) {
      if (!AVL.avlBalanced(g)) {
        const v = AVL.tallerChild(AVL.tallerChild(g));
        g = this.rotateAt(v);
      }
      BinTree.updateHeight(g);
    }
    return true;
  }

  static balanced(x) {
    return BinNode.stature(x.lc) === BinNode.stature(x.rc);
  }

  static balFac(x) {
    return BinNode.stature(x.lc) - BinNode.stature(x.rc);
  }

  static avlBalanced(x) {
    return AVL.balFac(x) > -2 && AVL.balFac(x) < 2;
  }

  static tallerChild(x) {
    if (BinNode.stature(x.lc) > BinNode.stature(x.rc)) {
      return x.lc;
    }
    if (BinNode.stature(x.rc) < BinNode.stature(x.lc)) {
      return x.rc;
    }
    if (BinNode.isLChild(x)) {
      return x.lc;
    } else {
      return x.rc;
    }
  }
}


export {
BST,
AVL,
};
