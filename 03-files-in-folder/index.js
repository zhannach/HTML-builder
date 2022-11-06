const { stdout } = require('process')
const { readdir, stat } = require('fs/promises');
const path = require('path');

(async function () {
    const files = await readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true })

    files.forEach(async (file) => {
        if (file.isFile()) {
            const pathFile = path.join(__dirname, 'secret-folder', file.name)
            const nameFile = path.basename(pathFile)
            const extention = path.extname(pathFile)
            const stats = await stat(pathFile)
            stdout.write( `${nameFile.replace(extention, '')} - ${extention.replace('.', '')} - ${Number(stats.size/1000).toFixed(3)}kb\n`);
        }
    })
})()

