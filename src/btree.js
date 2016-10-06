import BST from './bst';
import Vector from './vector';


class BTNode {
  constructor(e, lc = null, rc = null) {
    this.parent = null;
    if (arguments.length > 0) {
      this.key = new Vector([e]);
      this.child = new Vector([lc, rc]);
      if (lc) {
        lc.parent = this;
      }
      if (rc) {
        rc.parent = this;
      }
    } else {
      this.child = new Vector([null]);
      this.key = new Vector();
    }
  }
}

class BTree {
  constructor(order = 3) {
    this.size = 0;
    this.order = order;
    this.root = null;
    this.hot = null;
  }

  empty() {
    return !this.root;
  }

  search(e) {
    let v = this.root;
    this.hot = null;

    while (v) {
      const r = v.key.search(e);
      if ((r >= 0) && (e === v.key.get(r))) {
        return v;
      }
      this.hot = v;
      v = v.child.get(r + 1);
    }
    return null;
  }

  insert(e) {
    if (this.empty()) {
      this.size++;
      this.root = new BTNode(e);
      return true;
    }
    if (this.search(e)) {
      return false;
    }
    const r = this.hot.key.search(e);
    this.hot.key.insert(r + 1, e);
    this.hot.child.insert(r + 2, null);
    this.size++;
    this.solveOverflow(this.hot);
    return true;
  }

  remove(e) {
    let v = this.search(e);
    if (!v) {
      return false;
    }
    let r = v.key.search(e);
    if (v.child.get(0)) {
      let u = v.child.get(r + 1);
      while (u.child.get(0)) {
        u = u.child.get(0);
      }
      v.key.set(r, u.key.get(0));
      v = u; // swap
      r = 0;
    }
    v.key.remove(r);
    v.child.remove(r + 1);
    this.size--;
    this.solveUnderflow(v);
    return true;
  }

  solveOverflow(v) {
    if (this.order >= v.child.size()) {
      return;
    }
    const s = Math.floor(this.order / 2);
    const u = new BTNode();
    for (let j = 0; j < this.order - s - 1; j++) {
      u.child.insert(j, v.child.remove(s + 1));
      u.key.insert(j, v.key.remove(s + 1));
    }
    u.child.set(this.order - s - 1, v.child.remove(s + 1));
    if (u.child.get(0)) {
      for (let j = 0; j < this.order - s; j++) {
        u.child.get(j).parent = u;
      }
    }
    let p = v.parent;
    if (!p) {
      this.root = p = new BTNode();
      p.child.set(0, v);
      v.parent = p;
    }
    const r = 1 + p.key.search(v.key.get(0));
    p.key.insert(r, v.key.remove(s));
    p.child.insert(r + 1, u);
    u.parent = p;
    this.solveOverflow(p);
  }

  solveUnderflow(v) {
    if ((this.order + 1) / 2 <= v.child.size()) {
      return;
    }
    const p = v.parent;
    if (!p) {
      if (!v.key.size() && v.child.get(0)) {
        this.root = v.child.get(0);
        this.root.parent = null;
        v.child.set(0, null);
      }
      return;
    }
    let r = 0;
    while (p.child.get(r) !== v) {
      r++;
    }


    // borrow key from left sibling
    if (r > 0) {
      const ls = p.child.get(r - 1);
      if ((this.order + 1) / 2 < ls.child.size()) {
        console.log('borrow from left');
        v.key.insert(0, p.key.get(r - 1));
        p.key.set(r - 1, ls.key.remove(ls.key.size() - 1));
        v.child.insert(0, ls.child.remove(ls.child.size() - 1));

        if (v.child.get(0)) {
          v.child.get(0).parent = v;
        }
        return;
      }
    }

    // borrow key from right sibling

    if (p.child.size() - 1 > r) {
      const rs = p.child.get(r + 1);
      if ((this.order + 1) / 2 < rs.child.size()) {
        v.key.insert(v.key.size(), p.key.get(r));
        p.key.set(r, rs.key.remove(0));
        v.child.insert(v.child.size(), rs.child.remove(0));
        if (v.child.get(v.child.size() - 1)) {
          v.child.get(v.child.size() - 1).parent = v;
        }
        return;
      }
    }

    // merge left or right sibling
    if (r > 0) {
      const ls = p.child.get(r - 1);
      ls.key.insert(ls.key.size(), p.key.remove(r - 1));
      p.child.remove(r);
      ls.child.insert(ls.child.size(), v.child.remove(0));
      if (ls.child.get(ls.child.size() - 1)) {
        ls.child.get(ls.child.size() - 1).parent = ls;
      }
      while (!v.key.empty()) {
        ls.key.insert(ls.key.size(), v.key.remove(0));
        ls.child.insert(ls.child.size(), v.child.remove(0));
        if (ls.child.get(ls.child.size() - 1)) {
          ls.child.get(ls.child.size() - 1).parent = ls;
        }
      }
    } else {
      const rs = p.child.get(r + 1);
      rs.key.insert(0, p.key.remove(r));
      p.child.remove(r);
      rs.child.insert(0, v.child.remove(v.child.size() - 1));
      if (rs.child.get(0)) {
        rs.child.get(0).parent = rs;
      }
      while (!v.key.empty()) {
        rs.key.insert(0, v.key.remove(v.key.size() - 1));
        rs.child.insert(0, v.child.remove(v.child.size() - 1));
        if (rs.child.get(0)) {
          rs.child.get(0).parent = rs;
        }
      }
    }
    this.solveUnderflow(p);
    return;
  }
}

export {
BTNode,
BTree,
};
