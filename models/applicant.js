const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const applicationSchema = new Schema({
    applicantName: {
        type: String,
        required: true
    },
    applicantEmail: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    internship: {
        type: String, 
    },
    dateApplied: {
        type: Date,
        default: Date.now,
    },
});
module.exports=mongoose.model("Applicant",applicationSchema);