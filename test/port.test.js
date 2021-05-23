const { Server } = require('../lib/server')
const { join } = require('path')

const server = new Server()
let port

beforeAll(async () => {
  await server.serve(join(__dirname, '../example'), 0, false)
  port = server.port
})

test('should increase in use port by one', async done => {
  const s = new Server()
  await s.serve(join(__dirname, '../example'), port, false)
  expect(port + 1).toBe(s.port)
  s.kill()
  done()
})

afterAll(async () => {
  await server.kill()
})
