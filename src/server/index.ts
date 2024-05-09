import express from 'express'
import next from 'next'
import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

const port: number = parseInt(process.env.PORT || '8000', 10)
const dev: boolean = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

;(async () => {
  const db = await open({
    filename: './mydb.sqlite',
    driver: sqlite3.Database,
  })

  //   await db.migrate({ force: 'last' });

  app.prepare().then(() => {
    const server = express()

    server.get('/data', async (req, res) => {
      const data = await db.all('SELECT * FROM myTable')
      res.json(data)
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err?: any) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
})()
