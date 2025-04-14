import { v2 as cloudinary } from 'cloudinary'
import userModel from "../models/userModel.js"
import jobApplicationModel from "../models/jobApplicationsModel.js"
import jobModel from "../models/jobModel.js"


// Get user Data
export const getUserData = async (req, res) => {
    const userId = req.auth.userId

    try {
        const user = await userModel.findById(userId)

        if(!user) {
            return res.json({
                success: false,
                message: 'User not found!'
            })
        }

        res.json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

// Apply for a job
export const applyForJob = async (req, res) => {
    const { jobId } = req.body

    const userId = req.auth.userId

    try {
        const isAlreadyApplied = await jobApplicationModel.find({jobId, userId})

        if(isAlreadyApplied.length > 0) {
            return res.json({
                success: false,
                message: 'Already applied!'
            })
        }

        const jobData = await jobModel.findById(jobId)

        if(!jobData) {
            return res.json({
                success: false,
                message: 'Job not found!'
            })
        }

        await jobApplicationModel.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        })

        res.json({
            success: true,
            message: 'Applied successfully!'
        })

    } catch (error) {
        console.log(error)
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

// Get user applied applications
export const getUserJobApplications = async (req, res) => {
    try {
        const userId = req.auth.userId

        const applications = await jobApplicationModel.find({ userId })
        .populate('companyId', 'name email image')
        .populate('jobId', 'title description location category level salary')
        .exec()

        if(!applications) {
            return res.json({
                success: false,
                message: 'No jobs applications found!'
            })
        }

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

// Update user profile
export const updateUserResume = async (req, res) => {
    try {
        const userId = req.auth.userId

        const resumeFile = req.file

        const userDate = await userModel.findById(userId)

        if(resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userDate.resume = resumeUpload.secure_url
        }

        await userDate.save()

        return res.json({
            success: true,
            message: 'Resume updated!'
        })

    } catch (error) {
        console.log(error)
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}