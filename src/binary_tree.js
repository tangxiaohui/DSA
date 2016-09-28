import Queue from './queue';

const RB_RED = 0;
const RB_BALCK = 1;


class BinNode {
  constructor(e = null, parent = null, lc = null, rc = null,
              height = 0, npl = 1, color = RB_RED) {
    this.data = e;         // data
    this.parent = parent;  // parent node
    this.lc = lc;          // left children
    this.rc = rc;          // right children
    this.height = height;  // height
    this.npl = npl;        // Null Path Length
    this.color = color;    // rbtree color
  }

  // 计算机节点的子树规模
  size() {
    let s = 1;
    if (this.lc) {
      s += this.lc.size();
    }
    if (this.rc) {
      s += this.rc.size();
    }
    return s;
  }

  insertAsLC(e) {
    this.lc = new BinNode(e, this);
    return this.lc;
  }

  insertAsRC(e) {
    this.rc = new BinNode(e, this);
    return this.rc;
  }

  succ() {
    let s = this;
    if (this.rc) {
      s = rc;  // 若有右孩子，则直接后继西在右子树中
      while (BinNode.hasLChild(s)) {
        s = s.lc;  // 最靠左的节点
      }
    } else {  // 否则，直接后继应是 “将当前节点包含于其左子树的最低祖先”
      while (BinNode.hasRChild(s)) {
        s = s.parent;  // 逆向地沿右向分支，不断朝左上方移动
      }
      s = s.parent;  // 最后再朝右上方移动一步， 即抵达直接后继
    }
    return s;
  }

  travLevel(visit) {
    const q = new Queue();
    q.enqueue(this);
    while (!q.empty()) {
      const x = q.dequeue();
      visit(x.data);
      if (BinNode.hasLChild(x)) {
        q.enqueue(x.lc);
      }
      if (BinNode.hasRChild(x)) {
        q.enqueue(x.rc);
      }
    }
  }

  travPre(visit) {
    this.travPreRecursive(this, visit);
  }

  travPreRecursive(x, visit) {
    if (!x) {
      return;
    }
    visit(x.data);
    this.travPreRecursive(x.lc, visit);
    this.travPreRecursive(x.rc, visit);
  }

  travIn(visit) {
    this.travInRecusive(this, visit);
  }

  travInRecusive(x, visit) {
    if (!x) {
      return;
    }
    this.travInRecusive(x.lc, visit);
    visit(x.data);
    this.travInRecusive(x.rc, visit);
  }

  travPost(visit) {
    this.travPostRecusive(this, visit);
  }

  travPostRecusive(x, visit) {
    if (!x) {
      return;
    }
    this.travPostRecusive(x.lc, visit);
    this.travPostRecusive(x.rc, visit);
    visit(x.data);
  }

  lt(bnode) {
    return this.data < bnode.data;
  }

  eq(bnode) {
    return this.data === bnode.data;
  }

  gt(bnode) {
    return this.data > bnode.data;
  }

  static isRoot(x) {
    return !x.parent;
  }

  static isLChild(x) {
    return !BinNode.isRoot(x) && x === x.parent.lc;
  }

  static isRChild(x) {
    return !BinNode.isRoot(x) && x === x.parent.rc;
  }

  static hasParent(x) {
    return !BinNode.isRoot(x);
  }

  static hasLChild(x) {
    return x.lc;
  }

  static hasRChild(x) {
    return x.rc;
  }

  static hasChild(x) {
    return BinNode.hasLChild(x) || BinNode.hasRChild(x);
  }

  static hasBothChild(x) {
    return BinNode.hasLChild(x) && BinNode.hasRChild(x);
  }

  static isLeaf(x) {
    return !BinNode.hasChild(x);
  }

  static sibling(p) {
    return BinNode.isLChild(p) ? p.parent.rc : p.parent.lc;
  }

  static uncle(x) {
    return BinNode.isLChild(x.parent) ? x.parent.parent.rc : x.parent.parent.lc;
  }

  static stature(p) {
    return p ? p.height : -1;
  }
}

class BinTree {
  constructor(size = 0, root = null) {
    this.size = size;
    this.root = root;
  }

  static max(a, b) {
    return a > b ? a : b;
  }

  static updateHeight(x) {
    // virtual
    x.height = 1 + BinTree.max(BinNode.stature(x.lc), BinNode.stature(x.rc));
    return x.height;
  }

  static updateHeightAbove(x) {
    while (x) {
      BinTree.updateHeight(x);
      x = x.parent;
    }
  }

  static release(tree) {
    tree.root = null;
    tree.size = 0;
    // todo
  }

  empty() {
    return !this.root;
  }

  insertAsRoot(e) {
    this.size = 1;
    this.root = new BinNode(e);
    return this.root;
  }

  insertAsLC(x, e) {
    this.size++;
    x.insertAsLC(e);
    BinTree.updateHeightAbove(x);
    return x.lc;
  }

  insertAsRC(x, e) {
    this.size++;
    x.insertAsRC(e);
    BinTree.updateHeightAbove(x);
    return x.rc;
  }

  attachAsLC(x, tree) {
    x.lc = tree.root;
    if (x.lc) {
      x.lc.parent = x;
    }
    this.size += tree.size;
    BinTree.updateHeightAbove(x);
    BinTree.release(tree);
    return x;
  }

  attachAsRC(x, tree) {
    x.rc = tree.root;
    if (x.rc) {
      x.rc.parent = x;
    }
    this.size += tree.size;
    BinTree.updateHeightAbove(x);
    BinTree.release(tree);
    return x;
  }

  removeFromParent(x) {
    if (BinNode.isLChild(x)) {
      x.parent.lc = null;
    }
    if (BinNode.isRChild(x)) {
      x.parent.rc = null;
    }
    this.root = null;
  }

  removeAt(x) {
    if (!x) {
      return 0;
    }
    const n = 1 + this.removeAt(x.lc) + this.removeAt(x.rc);
    return n;
  }

  remove(x) {
    this.removeFromParent(x);
    BinTree.updateHeightAbove(x);
    const n = this.removeAt(x);
    this.size -= n;
    return n;
  }

  // 子树分离
  secede(x) {
    this.removeFromParent(x);
    BinTree.updateHeight(x.parent);
    const s = new BinTree();
    s.root = x;
    x.parent = null;
    s.size = x.size();
    this.size -= s.size;
    return s;
  }

  travLevel(visit) {
    if (this.root) {
      this.root.travLevel(visit);
    }
  }

  travPre(visit) {
    if (this.root) {
      this.root.travPre(visit);
    }
  }

  travIn(visit) {
    if (this.root) {
      this.root.travIn(visit);
    }
  }

  travPost(visit) {
    if (this.root) {
      this.root.travPost(visit);
    }
  }

  lt(tree) {
    return this.root && tree.root && this.root.lt(tree.root);
  }

  eq(tree) {
    return this.root && tree.root && this.root.eq(tree.root);
  }
}

export {
  BinNode,
  BinTree,
};
