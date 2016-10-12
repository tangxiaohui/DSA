import {
  List
} from './list';
import {
  rand
} from './util';

class Entry {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

  lt(e) {
    return this.key < e.key;
  }

  gt(e) {
    return this.key > e.key;
  }

  eq(e) {
    return this.key === e.key;
  }

  ne(e) {
    return this.key !== e.key;
  }
}

class QuadlistNode {
  constructor(e, pred = null, succ = null, above = null, below = null) {
    this.entry = e;
    this.pred = pred;
    this.succ = succ;
    this.above = above;
    this.below = below;
  }

  insertAsSuccAbove(e, b = null) {
    const x = new QuadlistNode(e, this, this.succ, null, b);
    this.succ.pred = x;
    this.succ = x;
    if (b) {
      b.above = x;
    }
    return x;
  }
}

class Quadlist {
  constructor() {
    this.header = new QuadlistNode(-Infinity);
    this.trailer = new QuadlistNode(Infinity);
    this.header.succ = this.trailer;
    this.header.pred = null;
    this.trailer.pred = this.header;
    this.trailer.succ = null;
    this.header.above = this.trailer.above = null;
    this.header.below = this.trailer.below = null;
    this.size = 0;
  }

  empty() {
    return !this.size;
  }

  first() {
    return this.header.succ;
  }

  last() {
    return this.trailer.pred;
  }

  valid(p) {
    return p && this.trailer !== p && this.header !== p;
  }

  remove(p) {
    p.pred.succ = p.succ;
    p.succ.pred = p.pred;
    this.size--;
    return p.entry;
  }

  insertAfterAbove(e, p, b = null) {
    this.size++;
    return p.insertAsSuccAbove(e, b);
  }

  traverse(vst) {
    let p = this.header.succ;
    while (p !== this.trailer) {
      vst(p.entry);
      p = p.succ;
    }
  }

  clear() {
    const oldSize = this.size;
    while (this.size > 0) {
      this.remove(this.header.succ);
    }
    return oldSize;
  }
}

class Skiplist extends List {
  constructor() {
    super();
    this.hot = null; // last one reach
  }

  qSize() {
    // return bottom level size
    return this.empty() ? 0 : this.last().data.size;
  }

  level() {
    // return skiplist size(level)
    return this.size;
  }

  put(k, v) {
    const e = new Entry(k, v);
    if (this.empty()) {
      this.insertAsFirst(new Quadlist());
    }
    // top level quadlist
    let qlist = this.first();
    // first node of quadlist
    let p = qlist.data.first();
    // find quadlist node by key
    p = this.skipSearch(qlist, p, k);
    if (p) {
      // turn p to bottom level in tower
      while (p.below) {
        p = p.below;
      }
    } else {
      // resume p to last reach node if not found
      p = this.hot;
    }
    // turn to bottom level
    qlist = this.last();
    // insert a quadlistNode with e behind p at bottom level
    let b = qlist.data.insertAfterAbove(e, p);
    // tower increase in rate of 50%
    while (rand() % 2) {
      // find previous one(include itself) with height(pred) > height(p)
      while (qlist.data.valid(p) && !p.above) {
        p = p.pred;
      }
      // if p === qlist.header
      if (!qlist.data.valid(p)) {
        // if qlist at top level, so there is one level
        if (qlist === this.first()) {
          // insert one level above bottom level
          this.insertAsFirst(new Quadlist());
        }
        // turn p to pred level's header
        p = qlist.pred.data.first().pred;
      } else {
        // if height(p) > 1, then turn p info above quadlistNode
        p = p.above;
      }
      // qlist turn info above level
      qlist = qlist.pred;
      // argument b is the new quadlistNode, insert b after p and above b
      b = qlist.data.insertAfterAbove(e, p, b);
    }
    return true;
  }

  get(k) {
    // check is empty
    if (this.empty()) {
      return null;
    }
    // get top level quadlist
    const qlist = this.first();
    // search the skiplist
    const p = this.skipSearch(qlist, qlist.data.first(), k);
    // return entry value if found or null if key not exist
    return p ? p.entry.value : null;
  }

  remove(k) {
    // check if empty
    if (this.empty()) {
      return false;
    }
    // get top level quadlist
    let qlist = this.first();
    // seach from first quadlistNode of top level quadlist
    let p = this.skipSearch(qlist, qlist.data.first(), k);
    // if key not exist
    if (!p) {
      return false;
    }
    // if key exist remove the tower
    do {
      // trun p to lower one and remove p
      const lower = p.below;
      // remove p in the quadlist(level by level)
      qlist.data.remove(p);
      p = lower;
      qlist = qlist.succ;
    } while (qlist.succ);
    while (!this.empty() && this.first().data.empty()) {
      // remove empty top level
      super.remove(this.first());
    }
    return true;
  }

  // qlist is the top level, p is the first node, k is key
  skipSearch(qlist, p, k) {
    while (true) {
      // find first one that entry.key > k
      while (p.succ && (p.entry.key <= k)) {
        p = p.succ;
      }
      p = p.pred;
      this.hot = p;
      // found the node that key == k and return node
      if (p.pred && (k === p.entry.key)) {
        return p;
      }
      // go next level
      qlist = qlist.succ;
      // make sure that p not in bottom level
      if (!qlist.succ) {
        return null;
      }
      // because p not in bottom level so p = p.below is ok
      p = p.pred ? p.below : qlist.data.first();
    }
  }
}

export {
  Entry,
  Quadlist,
  Skiplist,
  QuadlistNode,
};