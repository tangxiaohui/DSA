import rp from 'request-promise';
import Queue from './src/queue';

const seed = '57eb36ac86b5987977928881';
const srcUrl = `http://hr.tuputech.com/recruit/v2/tree?seed=${seed}`;

let treeId;
let treeObj;

function traverse(tree) {
  const queue = new Queue();
  const s = [];
  queue.enqueue(tree);
  while (!queue.empty()) {
    const q = queue.dequeue();
    s.push(rp({
      method: 'POST', uri: `http://hr.tuputech.com/recruit/tree/${q.type}`,
    }));

    for (let i = 0; i < q.child.length; i++) {
      queue.enqueue(q.child[i]);
    }
  }
  return s;
}

function buildTree(t, arr) {
  let arrIndex = 0;
  const qOld = new Queue();
  const qNew = new Queue();
  const tree = {};
  qOld.enqueue(t);
  qNew.enqueue(tree);
  while (!qOld.empty()) {
    const o = qOld.dequeue();
    const n = qNew.dequeue();
    n.result = arr[arrIndex++];
    n.child = [];

    for (let i = 0; i < o.child.length; i++) {
      qOld.enqueue(o.child[i]);
      qNew.enqueue(n.child[i] = {});
    }
  }
  return tree;
}


rp({
  method: 'GET',
  uri: srcUrl,
  json: true,
})
  .then((result) => {
    treeId = result.treeId;
    treeObj = result.tree;
    return result.tree;
  })
  .then((tree) => {
    return Promise.all(traverse(tree));
  })
  .then((nodes) => {
    return buildTree(treeObj, nodes);
  })
  .then((result) => {
    return rp({
      method: 'POST',
      uri: 'http://hr.tuputech.com/recruit/v2/tree',
      body: {
        treeId,
        result,
        seed,
      },
      json: true,
    });
  })
  .then((score) => {
    console.log('score:', score);
  })
  .catch((err) => {
    console.log(err);
  });
