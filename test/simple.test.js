import { Server } from '../lib/server.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { join } from 'path'
import request from 'supertest'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const server = new Server()
let port
let req

const hasNoBrackets = res => {
  if (/{{/gm.test(res.text)) throw new Error('has opening brackets')
  if (/}}/gm.test(res.text)) throw new Error('has closing brackets')
}

beforeAll(async () => {
  await server.serve(join(__dirname, '../example'), 0, false)
  port = server.port
  req = request(`http://localhost:${port}`)
})

test('server has random port', () => {
  expect(port).toBeGreaterThan(0)
  expect(port).toBeLessThan(65536)
})

test('should be able to access /', done => {
  req.get('/').expect('Content-Type', /html/).expect(hasNoBrackets).expect(200, done)
})

test('should display date on article page', done => {
  req
    .get('/article')
    .expect('Content-Type', /html/)
    .expect(/2021-05-19/)
    .expect(hasNoBrackets)
    .expect(200, done)
})

test('raw html page', done => {
  req
    .get('/raw')
    .expect('Content-Type', /html/)
    .expect(/normal HTML Page/i)
    .expect(hasNoBrackets)
    .expect(200, done)
})

test('404 page', done => {
  req
    .get('/nothing')
    .expect('Content-Type', /html/)
    .expect(/not found/i)
    .expect(hasNoBrackets)
    .expect(404, done)
})

test('wanilla-machine css', done => {
  req.get('/wanilla.css').expect('Content-Type', /css/).expect(hasNoBrackets).expect(200, done)
})

test('post request', done => {
  req
    .post('/something')
    .expect('Content-Type', /html/)
    .expect(/not found/i)
    .expect(hasNoBrackets)
    .expect(404, done)
})

afterAll(async () => {
  await server.kill()
})
