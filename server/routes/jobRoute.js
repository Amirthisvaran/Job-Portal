import express from 'express'
import { getJobById, getJobs } from '../controllers/jobController.js'

const jobRouter = express.Router()

// Route to get all jobs data
jobRouter.get('/', getJobs)

// Route to get a job by id
jobRouter.get('/:id', getJobById)

export default jobRouter