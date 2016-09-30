import GraphMatrix from '../src/graph';
import { expect } from 'chai';

/* 1 - have an edge and its weight is 1
 * 0 - haven't edge
 * direction u -> v
 * you can count outDegree by row and count
 * inDegree by column
*/
const matrix = [
/* u\v   A, B, C, D, E, F, G, S */
/* A */ [0, 0, 1, 0, 1, 0, 0, 0],
/* B */ [0, 0, 0, 0, 0, 0, 0, 0],
/* C */ [0, 1, 0, 0, 0, 0, 0, 0],
/* D */ [0, 1, 0, 0, 0, 0, 0, 0],
/* E */ [0, 0, 0, 0, 0, 1, 1, 0],
/* F */ [0, 0, 0, 0, 0, 0, 0, 0],
/* G */ [0, 1, 0, 0, 0, 1, 0, 0],
/* S */ [1, 0, 1, 1, 0, 0, 0, 0],
];

const vertexs = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'S'];

describe('Graph', () => {
  describe('constructor', () => {
    it('should build with matrix and vertex', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      expect(gm.n).to.equal(vertexs.length);
      expect(gm.e).to.equal(11);
    });
  });

  describe('vertex', () => {
    it('should return vertex', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      expect(gm.vertex(0).data).to.equal(vertexs[0]);
    });

    it('should be able to change the vertex status', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      gm.vertex(0).status = 'VISITED';
      expect(gm.vertex(0).status).to.equal('VISITED');
    });
  });

  describe('firstNbr', () => {
    it('should return first neighbor index', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      expect(gm.firstNbr(0)).to.equal(4);
      expect(gm.firstNbr(1)).to.equal(-1);
      expect(gm.firstNbr(2)).to.equal(1);
      expect(gm.firstNbr(3)).to.equal(1);
    });
  });

  describe('nextNbr', () => {
    it('should return next neighbor index', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      expect(gm.nextNbr(4, 6)).to.equal(5);
      expect(gm.nextNbr(6, 5)).to.equal(1);
      expect(gm.nextNbr(7, 0)).to.equal(-1);
    });
  });

  describe('exists', () => {
    it('should return true when edge exist', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      expect(gm.exists(0, 2)).to.be.true;
    });

    it('should return false when edge not exist', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      expect(gm.exists(0, 0)).to.be.false;
    });
  });

  describe('inDegree', () => {
    it('should return vertex inDegree', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      expect(gm.inDegree(0)).to.equal(1);
      expect(gm.inDegree(1)).to.equal(3);
      expect(gm.inDegree(2)).to.equal(2);
      expect(gm.inDegree(3)).to.equal(1);
    });
  });

  describe('outDegree', () => {
    it('should return vertex outDegree', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      expect(gm.outDegree(0)).to.equal(2);
      expect(gm.outDegree(1)).to.equal(0);
      expect(gm.outDegree(2)).to.equal(1);
      expect(gm.outDegree(3)).to.equal(1);
    });
  });

  describe('status', () => {
    it('should return status of ith vertex', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      gm.vertex(0).status = 'DISCOVER';
      expect(gm.status(0)).to.equal('DISCOVER');
    });
  });

  describe('dTime', () => {
    it('should return dTime of ith vertex', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      gm.vertex(0).dTime = 1;
      expect(gm.dTime(0)).to.equal(1);
    });
  });

  describe('fTime', () => {
    it('should return fTime of ith vertex', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      gm.vertex(0).fTime = 1;
      expect(gm.fTime(0)).to.equal(1);
    });
  });

  describe('parent', () => {
    it('should return parent of ith vertex', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      gm.vertex(0).parent = 1;
      expect(gm.parent(0)).to.equal(1);
    });
  });

  describe('priority', () => {
    it('should return priority of ith vertex', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      gm.vertex(0).priority = 1;
      expect(gm.priority(0)).to.equal(1);
    });
  });

  describe('insertVertex', () => {
    it('should insert a vertex', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      expect(gm.n).to.equal(8);
      gm.insertVertex('Z');
      expect(gm.n).to.equal(9);
    });
  });

  describe('removeVertex', () => {
    it('should remove a vertex', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      expect(gm.removeVertex(0).data).to.equal('A');
      expect(gm.vertex(0).data).to.equal('B');
      expect(gm.vertex(1).inDegree).to.equal(1);  // inDegree of 'C'
      expect(gm.vertex(6).outDegree).to.equal(2);
      expect(gm.n).to.equal(7);
    });
  });

  describe('edge', () => {
    it('should return edge', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      expect(gm.edge(0, 2).weight).to.equal(1);
    });
  });

  describe('insertEdge', () => {
    it('should insert edge', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      gm.insertEdge(100, 1, 0, 0);
      expect(gm.edge(0, 0).data).to.equal(100);
      expect(gm.outDegree(0)).to.equal(3);
      expect(gm.inDegree(0)).to.equal(2);
    });
  });

  describe('removeEdge', () => {
    it('should remove edge', () => {
      const gm = new GraphMatrix(0, 0, vertexs, matrix);
      gm.removeEdge(0, 2);
      expect(gm.edge(0, 2)).to.be.null;
      expect(gm.inDegree(2)).to.equal(1);
      expect(gm.outDegree(0)).to.equal(1);
    });
  });
});
