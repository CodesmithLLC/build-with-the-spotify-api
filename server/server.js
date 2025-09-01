import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import apiRouter from './apiRouter.js'

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors({ origin: ['http://localhost:5173/'] }))

app.use('/api', apiRouter)

app.get('/', (req, res) => {
  res.send('hello world!')
})

app.get('/callback', (req, res) => {
  const { code, state } = req.query
  console.log({ code, state })

  if (!state) {
    res.status(400).send('state mismatch')
    return
  }

  res.send('callback')
})

app.use((req, res) => {
  res.status(404).send('oops! nothing here.')
})

const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('something broke!')
}
app.use(globalErrorHandler)

app.listen(PORT, () =>
  console.log(`📡 server listening on http://localhost:${PORT}...`)
)
