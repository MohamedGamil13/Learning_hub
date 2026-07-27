const Enrollment = require("../models/enrollment.model")
const responseStatus = require("../constants/response.status")
module.exports = (req,res,next)=>{
    const enrollmentId = req.params.enrollmentId;
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment){
        return res.status(404).json({
            status : responseStatus.FAIL,
            data : {
                message : "Enrollment Not Found",
            }
        })
    }
    next();
}

