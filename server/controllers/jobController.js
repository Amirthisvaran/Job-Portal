import jobModel from "../models/jobModel.js"

// Get all jobs
export const getJobs = async (req, res) => {
    try {
        const jobs = await jobModel.find({ visible: true })
            .populate({ path: 'companyId', select: '-password' })
        res.json({
            success: true,
            jobs
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

// Get single job by id
export const getJobById = async (req, res) => {
    try {
        const { id } = req.params

        const job = await jobModel.findById(id)
        .populate({
            path: 'companyId',
            select: '-password'
        })
        
        if(!job) {
            return res.json({
                success: false,
                message: 'Job not found!'
            })
        }

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