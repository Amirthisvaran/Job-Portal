import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import { clerkWebHooks } from './controllers/webhooks.js'
import companyRouter from './routes/companyRoute.js'
import connectCloudinary from './config/cloudinary.js'
import jobRouter from './routes/jobRoute.js'
import userRouter from './routes/userRoute.js'
import { clerkMiddleware } from '@clerk/express'

// App config
const app = express()

// DB Connection
await connectDB()
await connectCloudinary()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res) => {
    res.send('API Working!')
})
app.post('/webhooks', clerkWebHooks)
app.use('/api/company', companyRouter)
app.use('/api/jobs', jobRouter)
app.use('/api/users', userRouter)

// Port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})