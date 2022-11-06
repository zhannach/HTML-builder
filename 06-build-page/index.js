const { copyFile, mkdir, readdir, readFile, writeFile, unlink, rm, stat } = require('fs/promises');
const path = require('path');
const fs = require('fs');
const { constants } = require('fs');

async function exists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function copyDir() {
  const newFolderPath = path.join(__dirname, 'project-dist', 'assets')
  const folderExists = await exists(newFolderPath)
  if (folderExists) {
    await rm(newFolderPath, { recursive: true })
  } else {
    await mkdir(newFolderPath, { recursive: true })
  }

  const folders = await readdir(path.join(__dirname, 'assets'), { withFileTypes: true })
  folders.forEach(async (folder) => {
    if (!folder.isDirectory()) return

    const newFolderPath = path.join(__dirname, 'project-dist', 'assets', folder.name)
    await mkdir(newFolderPath, { recursive: true })

    const files = await readdir(path.join(__dirname, 'assets', folder.name), { withFileTypes: true })
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(__dirname, 'assets', folder.name, file.name)
        const newFilePath = path.join(__dirname, 'project-dist', 'assets', folder.name, file.name)
        const fileExists = await exists(newFilePath)
        if (fileExists) return
        await copyFile(filePath, newFilePath, constants.COPYFILE_EXCL);
      }
    }
  })
}
copyDir()

async function changeCompon () {
  const newFolderPath = path.join(__dirname, 'project-dist')
  await mkdir(newFolderPath, { recursive: true })  //create final folder
  const newFilePath = path.join(__dirname, 'project-dist', 'index.html') //create new file html in final folder
  const pathTemplate = path.join(__dirname, 'template.html') //from where read code
  let content = await readFile(pathTemplate, { encoding: 'utf8' }); //read template
  const filesCompon = await readdir(path.join(__dirname, 'components'), { withFileTypes: true })

  for (const file of filesCompon) {
    const pathFile = path.join(__dirname, 'components', file.name)
    const nameFile = path.basename(pathFile).slice(0, -5)
    const extention = path.extname(pathFile)
    if (extention === '.html') {
      const placeholderHTML = await readFile(pathFile, { encoding: 'utf8' })
      content = content.replace(`{{${nameFile}}}`, placeholderHTML)
    }
  }
  await writeFile(newFilePath, content)

}
changeCompon()

  //_____styles
  async function copyStyles() {
    const files = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
    const newFilePath = path.join(__dirname, 'project-dist', 'style.css')
    const destination = fs.createWriteStream(newFilePath, { flags: 'w+' });
    for (const file of files) {
      const pathFile = path.join(__dirname, 'styles', file.name)
      const extention = path.extname(pathFile)
      if (file.isFile() && extention === '.css') {
        const readStream = fs.createReadStream(pathFile, 'utf-8');
        readStream.pipe(destination);
      }
    }
  }
  copyStyles()
