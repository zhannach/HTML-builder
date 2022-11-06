const { readdir} = require('fs/promises');
const path = require('path');
const fs = require('fs');


(async () => {
    const files = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
    const newFilePath = path.join(__dirname, 'project-dist', 'bundle.css')
    const destination = fs.createWriteStream(newFilePath, {flags: 'w+'});
    for (const file of files) {
      const pathFile = path.join(__dirname, 'styles', file.name)
      const extention = path.extname(pathFile)
      if (file.isFile() && extention === '.css') {
        const readStream = fs.createReadStream(pathFile, 'utf-8');
        readStream.pipe(destination);
      }
    } 
})()


