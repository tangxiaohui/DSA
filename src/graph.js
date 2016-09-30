import Vector from './vector';
import Queue from './queue';
import Stack from './stack';

// 顶点状态
const UNDISCOVERED = 0;
const DISCOVERED = 1;
const VISITED = 2;

// 边在遍历树中所属的类型
const UNDETERMINED = 0;
const TREE = 1;
const CROSS = 2;
const FORWARD = 3;
const BACKWARD = 4;

class Graph {
  constructor(n = 0, e = 0) {
    this.n = n;
    this.e = e;
  }

  reset() {
    for (let i = 0; i < this.n; i++) {
      this.vertex(i).status = UNDISCOVERED;
      this.vertex(i).dTime = -1;
      this.vertex(i).fTime = -1;
      this.vertex(i).parent = -1;
      this.vertex(i).priority = -1;

      for (let j = 0; j < n; j++) {
        if (this.exists(i, j)) {
          this.edge(i, j).type = UNDETERMINED;
        }
      }
    }
  }

  exists(i, j) {
    // virtual
  }

  vertex(i) {
    // virtual
  }

  edge(i, j) {
    // virtual
  }
}

class Vertex {
  constructor(d = 0) {
    this.data = d;
    this.inDegree = 0;
    this.outDegree = 0;
    this.status = UNDISCOVERED;
    this.dTime = -1;
    this.fTime = -1;
    this.parent = -1;
    this.priority = Number.MAX_VALUE;

    // alias for bcc
    this.hca = this.fTime;
  }
}

class Edge {
  constructor(d, w) {
    this.data = d;
    this.weight = w;
    this.type = UNDETERMINED;
  }
}

export default class GraphMatrix extends Graph {
  constructor(n = 0, e = 0, vertexs, matrix) {
    super(n, e);
    this.V = new Vector();
    this.E = new Vector();

    if (!Array.isArray(vertexs) || !Array.isArray(matrix)) {
      throw new Error('MUST pass matrix and vertexs to constructor');
    }

    if (vertexs.length !== matrix.length) {
      throw new Error('vertexs length must equal to matrix dimension');
    }

    vertexs.forEach(v => this.insertVertex(v));

    matrix.forEach((row, i) => {
      row.forEach((e, j) => {
        this.insertEdge(0, e, i, j); // 0 assing to edge.data
      });
    });
  }

  vertex(i) {
    return this.V.get(i);
  }

  firstNbr(i) {
    return this.nextNbr(i, this.n);
  }

  nextNbr(i, j) {
    while ((j > -1) && (!this.exists(i, --j)));
    return j;
  }

  exists(i, j) {
    return (
      (i >= 0) && (i < this.n) &&
      (j >= 0) && (j < this.n) &&
      !!this.E.get(i).get(j)
    );
  }

  // shortcut for get vertex(i) property
  inDegree(i) {
    return this.V.get(i).inDegree;
  }

  outDegree(i) {
    return this.V.get(i).outDegree;
  }

  status(i) {
    return this.V.get(i).status;
  }

  dTime(i) {
    return this.V.get(i).dTime;
  }

  fTime(i) {
    return this.V.get(i).fTime;
  }

  parent(i) {
    return this.V.get(i).parent;
  }

  priority(i, pri) {
    return this.V.get(i).priority;
  }

  insertVertex(vertex) {
    this.n++;
    this.E.insert(new Vector(Array.from({ length: this.n }, () => null)));
    this.V.insert(new Vertex(vertex));
  }

  removeVertex(i) {
    const vBak = this.vertex(i);

    for (let j = 0; j < this.n; j++) {
      // 扫描第i行
      if (this.exists(i, j)) {
        this.V.get(j).inDegree--;
      }
      // 扫描第j列
      if (this.exists(j, i)) {
        this.V.get(j).outDegree--;
      }
    }
    this.E.remove(i);
    this.V.remove(i);
    this.n--;
    return vBak;
  }

  edge(i, j) {
    return this.E.get(i).get(j);
  }

  weight(i, j) {
    return this.E.get(i).get(j).weight;
  }

  insertEdge(edge, w, i, j) {
    if (this.exists(i, j)) {
      return this.edge(i, j);
    }
    if (w > 0) {
      this.E.get(i).set(j, new Edge(edge, w));
      this.e++;
      this.V.get(i).outDegree++;
      this.V.get(j).inDegree++;
    }
    return this.edge(i, j);
  }

  removeEdge(i, j) {
    const eBak = this.edge(i, j);
    this.E.get(i).set(j, null);
    this.e--;
    this.V.get(i).outDegree--;
    this.V.get(j).inDegree--;
    return eBak;
  }

  bfs(s) {
    this.reset();
    const clock = 0;
    let v = s;
    do {
      if (UNDISCOVERED === this.status(v)) {
        this.bfsOne(v, clock);
      }
      v = ++v % this.n;
    } while (s !== v);
  }

  bfsOne(start, clock) {
    const q = new Queue();
    this.vertex(start).status = DISCOVERED;
    q.enqueue(start);
    while (!q.empty()) {
      const v = q.dequeue();
      this.dTime(v, ++clock);
      for (let u = this.firstNbr(v); u > -1; u = this.nextNbr(v, u)) {
        if (UNDISCOVERED === this.status(u)) {
          this.vertex(u).status = DISCOVERED;
          q.enqueue(u);
          this.edge(v, u).type = TREE;
          this.vertex(u).parent = v;
        } else {
          this.edge(v, u).type = CROSS;
        }
      }
      this.vertex(v).status = VISITED;
    }
  }

  dfs(s) {
    this.reset();
    let clock = 0;
    let v = s;
    do {
      if (UNDISCOVERED === this.status(v)) {
        clock = this.dfsOne(v, clock);
      }
      v = ++v % this.n;
    } while (s !== v);
  }

  dfsOne(v, clock) {
    this.vertex(v).dTime = ++clock;
    this.vertex(v).status = DISCOVERED;
    for (let u = this.firstNbr(v); u > -1; u = this.nextNbr(v, u)) {
      switch (this.status(u)) {
        case UNDISCOVERED: {
          this.edge(v, u).type = TREE;
          this.vertex(u).parent = v;
          clock = this.dfsOne(u, clock);
          break;
        }
        case DISCOVERED: {
          this.edge(v, u).type = BACKWARD;
          break;
        }
        default: {
          this.edge(v, u).type = (
            this.dTime(v) < this.dTime(u)
          ) ? FORWARD : CROSS;
        }
      }
    }
    this.vertex(v).status = VISITED;
    this.vertex(v).fTime = ++clock;
    return clock; // 由于使用了递归因此需要返回 clock
  }

  tSort(s) {
    this.reset();
    let clock = 0;
    let v = s;
    const S = new Stack();
    do {
      if (UNDISCOVERED === this.status(v)) {
        if (!this.tsortOne(v, clock, S)) {
          while (!S.empty()) {
            S.pop();
            break;
          }
        }
      }
    } while (s != (v = (++v % n)));
    return S;
  }

  tsortOne(v, clock, S) {
    this.dTime(v, ++clock);
    this.status(v, DISCOVERED);
    for (let u = this.firstNbr(v); u > -1; u = this.nextNbr(v, u)) {
      switch (this.status(u)) {
        case UNDISCOVERED: {
          this.parent(u, v);
          this.edge(v, u).type = TREE;
          if (!this.tsortOne(u, clock, S)) {
            return false;
          }
          break;
        }
        case DISCOVERED: {
          this.edge(v, u).type = BACKWARD;
          return false;
        }
        default: {
          this.edge(v, u).type = (this.dTime(v) < this.dTime(u) ? FORWARD : CROSS);
          break;
        }
      }
    }
    this.vertex(v).status = VISITED;
    S.push(this.vertex(v));
    return false;
  }

  bcc(s) {
    this.reset();
    let clock = 0;
    let v = s;
    const S = new Stack();
    do {
      if (UNDISCOVERED === this.status(v)) {
        this.bccOne(v, clock, S);
        S.pop();
      }
      v = ++v % this.n;
    } while (s !== v);
  }

  bccOne(v, clock, S) {
    this.hca(v, ++clock);
    this.dTime(v, ++clock);
    this.status(v, DISCOVERED);
    S.push(v);
    for (let u = this.firstNbr(v); u > -1; u = this.nextNbr(v, u)) {
      switch (this.status(u)) {
        case UNDISCOVERED: {
          this.parent(u, v);
          this.edge(v, u).type = TREE;
          this.bccOne(u, clock, S);
          if (this.hca(u) < this.dTime(v)) {
            this.vertex(v).fTime = Math.min(this.hca(v), this.hca(u));
          } else {
            while (v !== S.pop());
            S.push(v);
          }
          break;
        }
        case DISCOVERED: {
          this.edge(v, u).type = BACKWARD;
          if (u !== this.parent(v)) {
            this.vertex(v).fTime = Math.min(this.hca(v), this.dTime(u));
          }
          break;
        }
        default:
          this.edge(v, u).type = this.dTime(v) < this.dTime(u) ? FORWARD : CROSS;
      }
    }
    this.vertex(v).status = VISITED;
  }

  pfs(s, prioUpdater) {
    this.reset();
    let v = s;
    do {
      if (UNDISCOVERED === this.status(v)) {
        this.pfsOne(v, prioUpdater);
      }
      v = ++v % this.n;
    } while (s !== v);
  }

  pfsOne(s, prioUpdater) {
    this.priority(s, 0);
    this.status(s, VISITED);
    this.parent(s, -1);
    while (true) {
      for (let w = this.firstNbr(s); w > -1; w = this.nextNbr(s, w)) {
        this.prioUpdater(this, s, w);
      }
      for (let shortest = Number.MAX_VALUE, w = 0; w < n; w++) {
        if (UNDISCOVERED === this.status(w)) {
          if (shortest > this.priority(w)) {
            shortest = this.priority(w);
            s = w;
          }
        }
      }
      if (this.status(s) === VISITED) {
        break;
      }
      this.vertex(s).status = VISITED;
      this.edge(this.parent(s), s).type = TREE;
    }
  }

  static PrimPU(g, uk, v) {
    if (g.status(v) === UNDISCOVERED) {
      if (g.priority(v) > g.weight(uk, v)) {
        g.priority(v, g.weight(uk, v));
        g.parent(v, uk);
      }
    }
  }

  static DijkstraPU() {
    if (g.status === UNDISCOVERED) {
      if (g.priority(v) > g.priority(uk) + g.weight(uk, v)) {
        g.priority(v, g.priority(uk) + g.weight(uk, v));
        g.parent(v, uk);
      }
    }
  }

  static BfsPU(g, uk, v) {
    if (g.status(v) === UNDISCOVERED) {
      if (g.priority(v) > g.priority(uk) + 1) {
        g.vertex(v).priority = g.priority(uk) + 1;
        g.vertex(v).parent = uk;
      }
    }
  }

  static DfsPU(g, uk, v) {
    if (g.status(v) === UNDISCOVERED) {
      if (g.priority(v) > g.priority(uk) - 1) {
        g.vertex(v).priority = g.priority(uk) - 1;
        g.vertex(v).parent = uk;
        return;
      }
    }
  }
}


