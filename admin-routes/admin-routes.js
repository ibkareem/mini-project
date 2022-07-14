"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const controls_1 = require("../controller/controls");
const admin = express_1.default.Router();
exports.admin = admin;
const publicPath = path_1.default.join(process.cwd(), "/public");
admin.use(express_1.default.json());
admin.use(express_1.default.static(publicPath));
admin.post("/dashboard", controls_1.CONTROL.adminLoginAuth, (req, res) => {
    //   res.sendFile(`${publicPath}/admin-dashboard.html`);
});
admin.get("/dashboard", controls_1.CONTROL.adminDashboardAuth, (req, res) => { });
admin.get("/signup", (req, res) => {
    res.sendFile(`${publicPath}/admin-signup.html`);
});
admin.get("/login", (req, res) => {
    res.sendFile(`${publicPath}/admin-login.html`);
});
admin.post("/admin-access", controls_1.CONTROL.saveRequest, (req, res) => {
    res.json({ message: "done" });
});
//get new account request notification
admin.get("/checkAccountRequest", controls_1.CONTROL.checkAccountRequest, (req, res) => { });
//get all apllicants
admin.get("/getAllApplicants", controls_1.CONTROL.getAllApplicants, (req, res) => { });
//update applicant details
admin.post("/deleteApplicant", controls_1.CONTROL.removeApplicant, (req, res) => { });
//accept applicants
admin.post("/acceptApplicant", controls_1.CONTROL.acceptApplicant, (req, res) => { });
