// imports
import { error, step } from 'node-cli'
import path, { dirname } from 'path'
import { AddressInfo } from 'net'
import express from 'express'
import { fileURLToPath } from 'url'
import http from 'http'
import { join } from 'path'
import { middleware } from './middleware.js'
import openDefaultBrowser from 'open'
import { readFile } from 'fs/promises'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// server
export class Server {
  port!: number
  httpServer!: http.Server
  sockets: Set<any> = new Set()

  public async kill(): Promise<void> {
    for (const socket of this.sockets) {
      socket.destroy()
      this.sockets.delete(socket)
    }

    return new Promise(resolve => {
      console.log('close')
      this.httpServer.close(() => {
        return resolve()
      })
    })
  }

  private listen(port: number | string): Promise<void> {
    let _port: number = typeof port === 'string' ? parseInt(port) : parseInt(port.toFixed(2))

    return new Promise((resolve, reject) => {
      // Handle server startup errors
      this.httpServer.once('error', (e: any) => {
        if (e.code && e.code === 'EADDRINUSE') {
          setTimeout(() => {
            this.listen((_port += 1))
          }, 500)
        } else {
          this.kill()
          reject(e)
        }
      })

      this.httpServer.on('connection', socket => {
        this.sockets.add(socket)
      })

      // Handle successful httpServer
      this.httpServer.once('listening', (/*e*/) => {
        this.port = (this.httpServer.address() as AddressInfo).port
        resolve()
      })

      this.httpServer.listen(_port)
    })
  }

  public async serve(root: string = process.cwd(), port: string | number = 4500, open = false) {
    port = typeof port === 'string' ? parseInt(port) : port

    // express
    const app = express()
    this.httpServer = http.createServer(app)

    // absolute root
    if (!path.isAbsolute(root)) root = join(process.cwd(), root)

    // render
    const config = { root: root, debug: false, dev: true }
    app.use(middleware(config))

    // send
    app.get('*', (req, res, next) => {
      // do what ever you want with "res.locals.html" before sending it to the client
      if (res.locals.html) return res.send(res.locals.html)
      else return next()
    })

    // serve wanilla.css
    let wanilla
    app.get('/wanilla.css', async (req, res) => {
      res.type('css')

      if (wanilla) return res.send(wanilla)
      return res.send(await readFile(join(__dirname, '../css/wanilla.css'), { encoding: 'utf-8' }))
    })

    // serve static files (serve .html file without extension)
    app.use(express.static(root, { extensions: ['html'] }))

    // 404
    app.use('*', (req, res) => {
      return res.status(404).send('NOT FOUND')
    })

    // listen
    try {
      await this.listen(port)
      step(`Listening at http://localhost:${this.port}`)
      if (open) {
        step(`Opening Browser`)
        openDefaultBrowser(`http://localhost:${this.port}`).catch(() => {
          error(`Could not open browser at http://localhost:${this.port}`, false)
        })
      }
    } catch (err: any) {
      error(err.message, true)
    }
  }
}
