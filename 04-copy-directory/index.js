const { copyFile, mkdir, readdir, stat, unlink } = require('fs/promises');
const path = require('path');
const { constants } = require('fs');

async function exists (path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function copyDir() {
    const newFolderPath = path.join(__dirname, 'files-copy')
    const folderExists = await exists(newFolderPath)
    if (folderExists) {
      const files = await readdir(newFolderPath, { withFileTypes: true })
      files.forEach( async (file) => {
        const filePath = path.join(__dirname, 'files-copy', file.name) 
        await unlink(filePath)
      })
    } else {
      await mkdir(newFolderPath, { recursive: true })
    }
    
    const files = await readdir(path.join(__dirname, 'files'), { withFileTypes: true })
    files.forEach(async (file) => {
      if (file.isFile()) {
        const filePath = path.join(__dirname, 'files', file.name) 
        const newFilePath = path.join(__dirname, 'files-copy', file.name)
        const fileExists = await exists(newFilePath)
        if (fileExists) return
        await copyFile(filePath, newFilePath, constants.COPYFILE_EXCL);
      }
    }


  )
}

copyDir()


