import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import apiRouter from './routes/apiRouter.js'
import callbackRouter from './routes/callbackRouter.js'

const app = express()
const PORT = 3000

app.use(express.json())
app.use(
  cors({
    origin: ['http://localhost:5173'],
  })
)

app.use('/api', apiRouter)
app.use('/callback', callbackRouter)

app.get('/', (_req, res) => {
  res.status(200).json({ route: '/', status: 'ok' })
})

app.use((_req, res) => {
  res.status(404).send('Oops! Nothing here.')
})

const globalErrorHandler = (err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).send(`Something went wrong: ${err.message}`)
}
app.use(globalErrorHandler)

app.listen(PORT, () =>
  console.log(`📡 Server listening on http://localhost:${PORT}...`)
)

export default app
