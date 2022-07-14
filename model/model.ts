import mongoose from "mongoose";

//schema for Decadev
const DecadevSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const Decadev = mongoose.model("decadevs", DecadevSchema);

const ApplicantSchema = new mongoose.Schema({
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

const Applicant = mongoose.model("Applicant", ApplicantSchema);

const SuccessfullApplicants = mongoose.model(
  "successfulApplicants",
  ApplicantSchema
);

const AdminAccessSchema = new mongoose.Schema({
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

const AdminRequest = mongoose.model("adminRequest", AdminAccessSchema);

const DB = {
  //database connector
  async connector() {
    var DBConnectionStatus = 0;
    const url = "mongodb://127.0.0.1:27017/decadev";
    const cloud =
      "mongodb+srv://decagon:decagon@cluster0.cocewbr.mongodb.net/applicantsDB?retryWrites=true&w=majority";
    const options = {
      serverSelectionTimeoutMS: 5000,
    };
    try {
      await mongoose.connect(cloud, options);
      console.log("mongoose connected to database");
      DBConnectionStatus = 1;
      return DBConnectionStatus;
    } catch (error) {
      console.log(error);
    }
  },

  //----> create a new entry from signup
  async createDecadev(options: object) {
    const decadev = new Decadev(options);
    const status = await decadev.save();
    // return status; ---->development only
  },

  async findOneDecadev(squadNo: string) {
    const decadev = await Decadev.findOne({ squadNo: squadNo });
    return decadev;
  },

  //update token during login---------->
  async updateToken(id: any, token: string) {
    await Decadev.findOneAndUpdate({ _id: id }, { token: token });
  },

  //update profile image
  async updateImage(id: any, imageBuffer: string) {
    await Decadev.findOneAndUpdate({ squadNo: id }, { image: imageBuffer });
  },
  //ADMIN ROUTES
  //get all applicants
  async getAllApplicants() {
    return await Applicant.find({});
  },
  //get one applicant
  async getOneApplicant(email: string) {
    return await Applicant.findOne({ emailAddress: email });
  },
  //accept applicant
  async acceptApplicant(body: any) {
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
  async saveRequest(data: any) {
    return await AdminRequest.insertMany({
      fullname: data.fullname,
      email: data.email,
      position: data.accountType,
    });
  },
  //update superuser Admin token
  async updateAdminToken(token: string) {
    return await AdminRequest.findOneAndUpdate(
      { fullname: "admin" },
      { position: token }
    );
  },
  //check for new requests in DB
  async checkAccountRequest() {
    return await AdminRequest.find({});
  },

  //update applicants
  async deleteApplicant(email: string) {
    await Applicant.findOneAndDelete({ emailAddress: email });
  },
};
// starting the database connector ---------> development only !!important
// DB.connector("mongodb://127.0.0.1:27017/decadev", {
//   serverSelectionTimeoutMS: 5000,
// });

// testing the db connection
// DB.createDecadev({
//   firstName: "ikeoluwa",
//   lastName: "Ibrahim",
//   email: "kareemibrahim30@gmail.com",
//   stack: "nodejs",
//   squadNo: "010/122",
//   password: "grgdgb",
// });

export { DB };
