const path = require('path');
const fs = require('fs');

const stream = fs.createReadStream(
    path.join(__dirname, 'text.txt'), 'utf-8');

stream.on('data', data => {
    console.log(data);
});