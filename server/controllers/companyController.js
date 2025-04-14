import companyModel from '../models/companyModel.js'
import jobModel from '../models/jobModel.js'
import jobApplicationModel from '../models/jobApplicationsModel.js'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import generateToken from '../utils/generateToken.js'

// Register a new company
export const registerCompany = async (req, res) => {
    const { name, email, password } = req.body
    const imageFile = req.file

    if (!name || !email || !password || !imageFile) {
        return res.json({
            success: false,
            message: 'Missing required files!'
        })
    }

    try {
        const companyExists = await companyModel.findOne({ email })

        if (companyExists) {
            return res.json({
                success: false,
                message: 'Company already exists!'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        const company = await companyModel.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
        })

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        })

    } catch (error) {
        console.log(error)
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

// Company login
export const loginCompany = async (req, res) => {
    const { email, password } = req.body

    try {
        const company = await companyModel.findOne({ email })

        if (await bcrypt.compare(password, company.password)) {
            res.json({
                success: true,
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token: generateToken(company._id)
            })
        } else {
            res.json({
                success: false,
                message: 'Invalid email or password!'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

// Get company data
export const getCompanyData = async (req, res) => {
    try {
        const company = req.company
        res.json({
            success: true,
            company
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

// Post a new job
export const postJob = async (req, res) => {
    const { title, description, location, salary, level, category } = req.body

    const companyId = req.company._id

    console.log(companyId, {title, description, location, salary})

    try {
        const newJob = new jobModel({
            title,
            description,
            location,
            level, 
            category,
            salary,
            date: Date.now(),
            companyId
        })

        await newJob.save()

        res.json({
            success: true,
            newJob
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

// Get company job applicants
export const getCompanyJobApplicants = async (req, res) => {
    try {
        const companyId = req.company._id

        // Find job applications for the user and populate related data
        const applications = await jobApplicationModel.find({companyId})
        .populate('userId', 'name image resume')
        .populate('jobId', 'title location category level salary')
        .exec()

        return res.json({
            success: true,
            applications
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

// Get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {
    try {
        const companyId = req.company._id

        const jobs = await jobModel.find({companyId})

        // Adding No of applicants info in data
        const jobsData = await Promise.all(jobs.map(async (job) => {
            const applicants = await jobApplicationModel.find({jobId: job._id})
            return {...job.toObject(), applicants: applicants.length}
        }))

        res.json({
            success: true,
            jobsData
        })

    } catch (error) {
        console.log(error)
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

// Change job application status
export const changeJobApplicationsStatus = async (req, res) => {
    try {
        const { id, status } = req.body

    // Find job application data and update
    await jobApplicationModel.findOneAndUpdate({_id: id},{status})

    res.json({
        success: true,
        message: 'Status changed!'
    })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

// Change job visibility
export const changeVisibility = async (req, res) => {
    try {
        const { id } = req.body

        const companyId = req.company._id

        const job = await jobModel.findById(id)

        if(companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible
        }

        await job.save()

        res.json({
            success: true,
            job
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}