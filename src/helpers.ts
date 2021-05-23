// copied and modified from https://gist.github.com/tkihira/3014700

import fs from 'fs'
import path from 'path'

export const move = (source, destination) => {
  const oldFile = fs.createReadStream(source)
  const newFile = fs.createWriteStream(destination)

  oldFile.pipe(newFile)
  oldFile.on('end', function () {
    fs.unlinkSync(source)
  })
}

export const copy = function (src, dest) {
  const oldFile = fs.createReadStream(src)
  const newFile = fs.createWriteStream(dest)
  oldFile.pipe(newFile)
}

export const mkdir = function (dir) {
  // making directory without exception if exists
  try {
    fs.mkdirSync(dir)
  } catch (e) {
    if (e.code != 'EEXIST') {
      throw e
    }
  }
}

export const rmdir = function (dir) {
  if (fs.existsSync(dir)) {
    const list = fs.readdirSync(dir)
    for (let i = 0; i < list.length; i++) {
      const filename = path.join(dir, list[i])
      const stat = fs.statSync(filename)

      if (filename == '.' || filename == '..') {
        // pass these files
      } else if (stat.isDirectory()) {
        // rmdir recursively
        rmdir(filename)
      } else {
        // rm fiilename
        fs.unlinkSync(filename)
      }
    }
    fs.rmdirSync(dir)
  } else {
    console.warn(`warn: ${dir} not exists`)
  }
}

export const copyDir = function (src, dest) {
  mkdir(dest)
  const files = fs.readdirSync(src)
  for (let i = 0; i < files.length; i++) {
    const current = fs.lstatSync(path.join(src, files[i]))
    if (current.isDirectory()) {
      copyDir(path.join(src, files[i]), path.join(dest, files[i]))
    } else if (current.isSymbolicLink()) {
      const symlink = fs.readlinkSync(path.join(src, files[i]))
      fs.symlinkSync(symlink, path.join(dest, files[i]))
    } else {
      copy(path.join(src, files[i]), path.join(dest, files[i]))
    }
  }
}
