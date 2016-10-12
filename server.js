const http = require('http');
const qs = require('qs');
const multiparty = require('multiparty');
const util = require('util');


const server = http.createServer((req, res) => {
  const form = new multiparty.Form();
  if (req.method === 'POST') {
    form.parse(req);
    form.on('part', (part) => {
      part.pipe(res);
    });
  } else {
    res.end('ok');
  }
});

server.listen(8000, () => {
  console.log('sever listening on 8000');
});
