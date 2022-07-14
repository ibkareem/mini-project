"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//schema for Decadev
const DecadevSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    stack: {
        type: String,
        trim: true,
        lowecase: true,
    },
    squadNo: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        default: "Not Authenthicated",
    },
    image: {
        type: String,
        default: `url('../img/add-dp-icon.png')`,
    },
}, { timestamps: true });
const Decadev = mongoose_1.default.model("decadevs", DecadevSchema);
const ApplicantSchema = new mongoose_1.default.Schema({
    firstName: String,
    lastName: String,
    middleName: String,
    emailAddress: String,
    dateOfBirth: Date,
    phoneNumber: Number,
    whatsappPhoneNumber: Number,
    stateOfOrigin: String,
    highestQualification: String,
    courseOfStudy: String,
    gradeAchieved: String,
    gender: String,
    currentLocation: String,
    nyscStatus: String,
    password: String,
});
const Applicant = mongoose_1.default.model("Applicant", ApplicantSchema);
const SuccessfullApplicants = mongoose_1.default.model("successfulApplicants", ApplicantSchema);
const AdminAccessSchema = new mongoose_1.default.Schema({
    fullname: {
        type: String,
    },
    email: {
        type: String,
    },
    position: {
        type: String,
        required: true,
    },
});
const AdminRequest = mongoose_1.default.model("adminRequest", AdminAccessSchema);
const DB = {
    //database connector
    async connector() {
        var DBConnectionStatus = 0;
        const url = "mongodb://127.0.0.1:27017/decadev";
        const cloud = "mongodb+srv://decagon:decagon@cluster0.cocewbr.mongodb.net/applicantsDB?retryWrites=true&w=majority";
        const options = {
            serverSelectionTimeoutMS: 5000,
        };
        try {
            await mongoose_1.default.connect(cloud, options);
            console.log("mongoose connected to database");
            DBConnectionStatus = 1;
            return DBConnectionStatus;
        }
        catch (error) {
            console.log(error);
        }
    },
    //----> create a new entry from signup
    async createDecadev(options) {
        const decadev = new Decadev(options);
        const status = await decadev.save();
        // return status; ---->development only
    },
    async findOneDecadev(squadNo) {
        const decadev = await Decadev.findOne({ squadNo: squadNo });
        return decadev;
    },
    //update token during login---------->
    async updateToken(id, token) {
        await Decadev.findOneAndUpdate({ _id: id }, { token: token });
    },
    //update profile image
    async updateImage(id, imageBuffer) {
        await Decadev.findOneAndUpdate({ squadNo: id }, { image: imageBuffer });
    },
    //ADMIN ROUTES
    //get all applicants
    async getAllApplicants() {
        return await Applicant.find({});
    },
    //get one applicant
    async getOneApplicant(email) {
        return await Applicant.findOne({ emailAddress: email });
    },
    //accept applicant
    async acceptApplicant(body) {
        const { data } = body;
        return await SuccessfullApplicants.insertMany([
            {
                firstName: data.firstName,
                lastName: data.lastName,
                middleName: data.middleName,
                emailAddress: data.emailAddress,
                dateOfBirth: data.dateOfBirth,
                phoneNumber: data.phoneNumber,
                whatsappPhoneNumber: data.whatsappPhoneNumber,
                stateOfOrigin: data.stateOfOrigin,
                highestQualification: data.highestQualification,
                courseOfStudy: data.courseOfStudy,
                gradeAchieved: data.gradeAchieved,
                gender: data.gender,
                currentLocation: data.currentLocation,
                nyscStatus: data.nyscStatus,
                password: data.password,
            },
        ]);
    },
    //save newAdmin Request
    async saveRequest(data) {
        return await AdminRequest.insertMany({
            fullname: data.fullname,
            email: data.email,
            position: data.accountType,
        });
    },
    //update superuser Admin token
    async updateAdminToken(token) {
        return await AdminRequest.findOneAndUpdate({ fullname: "admin" }, { position: token });
    },
    //check for new requests in DB
    async checkAccountRequest() {
        return await AdminRequest.find({});
    },
    //update applicants
    async deleteApplicant(email) {
        await Applicant.findOneAndDelete({ emailAddress: email });
    },
};
exports.DB = DB;
