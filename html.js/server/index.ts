
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';

const app = new Hono()
app.use('/src/*', serveStatic({ root: './' }))
app.use('/spec/*', serveStatic({ root: './' }))
app.use('/tmp/*', serveStatic({ root: './' }))
app.get('/', (c) => c.text('Hello, Bun!'))

export default {
  port: 3000,
  fetch: app.fetch
}
