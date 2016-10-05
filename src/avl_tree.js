import BST from './bst';
import { BinTree, BinNode } from './binary_tree';

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

export default AVL;
