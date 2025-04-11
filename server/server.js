import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import { clerkWebHooks } from './controllers/webhooks.js'

// App config
const app = express()

// DB Connection
await connectDB()

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => {
    res.send('API Working!')
})
app.post('/webhooks', clerkWebHooks)

// Port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})