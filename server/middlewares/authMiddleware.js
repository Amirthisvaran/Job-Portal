import jwt from 'jsonwebtoken'
import companyModel from '../models/companyModel.js'

export const protectCompany = async (req, res, next) => {
    const token = req.headers.token

    if(!token) {
        return res.json({
            success: false,
            message: 'Not authorized, Login again!'
        })
    }

    try {
        const decoded  = jwt.verify(token, process.env.JWT_SECRET)

        req.company = await companyModel.findById(decoded.id).select('-password')

        next()
    } catch (error) {
        console.log(error)
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}