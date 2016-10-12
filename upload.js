const fs = require('fs');
const path = require('path');
const request = require('request');

const option = {
  method: 'POST',
  uri: 'http://hr.tuputech.com/recruit/v2/tree/file',
  json: true,
  formData: {
    seed: '57eb36ac86b5987977928881',
    name: '林泽杭',
    mobile: '18501608549',
    uploadCodes: fs.createReadStream(path.resolve(__dirname, './test1.js')),
  },
  headers: {
    'content-type': '',
  },
};


request(option, (err, res) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(res.body);
});
