import { Server } from '../lib/server.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { join } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const server = new Server()
let port

beforeAll(async () => {
  await server.serve(join(__dirname, '../example'), 0, false)
  port = server.port
})

test('should increase in use port by one', async () => {
  const s = new Server()
  await s.serve(join(__dirname, '../example'), port, false)
  expect(port + 1).toBe(s.port)
  s.kill()
})

afterAll(async () => {
  await server.kill()
})
