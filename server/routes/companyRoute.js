import express from 'express'
import { registerCompany, loginCompany, getCompanyData, postJob, getCompanyJobApplicants, getCompanyPostedJobs, changeJobApplicationsStatus, changeVisibility } from '../controllers/companyController.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middlewares/authMiddleware.js'

const companyRouter = express.Router()

// Register a company
companyRouter.post('/register', upload.single('image'), registerCompany)

// Company Login
companyRouter.post('/login', loginCompany)

// Get company data
companyRouter.get('/company', protectCompany, getCompanyData)

// Post a job
companyRouter.post('/post-job', protectCompany, postJob)

// Get applicants data of company
companyRouter.get('/applicants', protectCompany, getCompanyJobApplicants)

// Get company joblist
companyRouter.get('/list-jobs', protectCompany, getCompanyPostedJobs)

// Change application status
companyRouter.post('/change-status', protectCompany, changeJobApplicationsStatus)

// Change applications visibility
companyRouter.post('/change-visibility', protectCompany, changeVisibility)

export default companyRouter