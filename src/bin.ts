#!/usr/bin/env node

import { Arguments, success } from 'node-cli'
import { Server } from './server'
import { VERSION } from './version'
import { copyDir } from './helpers'
import { join } from 'path'

const Args = new Arguments()

const root: string = Args.getArgument(0) || '.'
const port: number | undefined = Args.getOption('port')?.[0]
const open: boolean = Args.getOption('open')?.[0] === 'false' ? false : true
const init: boolean = Args.getOptions()['init'] ? true : false
const help: boolean = Args.getOptions()['help'] ? true : false
const version: boolean = Args.getOptions()['v'] || Args.getOptions()['version'] ? true : false

// display version
if (version) {
  console.log(VERSION)
}

// display help
else if (help) {
  console.log(`
Wanilla Machine (v${VERSION})

USAGE
  npx wanilla-machine <root> [options]

ARGUMENTS
  root                    FOLDER

OPTIONS
  --help                  Display help
  --init                  Initialize a starter project
  --open=<boolean>        Whether or not to open the browser
  --port=<number>         Set the server port
  --version -v            Print version
`)
}

// initialize the starter project
else if (init) {
  copyDir(join(__dirname, '../example'), join(process.cwd()))

  console.log('')
  success('Project Initialized', null)
  console.log('')
}

// start the server
else {
  new Server().serve(root, port, open)
}
