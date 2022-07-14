import express from "express";
import path from "path";
import { CONTROL } from "../controller/controls";
const admin = express.Router();

const publicPath = path.join(process.cwd(), "/public");
admin.use(express.json());
admin.use(express.static(publicPath));

admin.post("/dashboard", CONTROL.adminLoginAuth, (req, res) => {
  //   res.sendFile(`${publicPath}/admin-dashboard.html`);
});

admin.get("/dashboard", CONTROL.adminDashboardAuth, (req, res) => {});

admin.get("/signup", (req, res) => {
  res.sendFile(`${publicPath}/admin-signup.html`);
});

admin.get("/login", (req, res) => {
  res.sendFile(`${publicPath}/admin-login.html`);
});

admin.post("/admin-access", CONTROL.saveRequest, (req, res) => {
  res.json({ message: "done" });
});

//get new account request notification
admin.get(
  "/checkAccountRequest",
  CONTROL.checkAccountRequest,
  (req, res) => {}
);

//get all apllicants
admin.get("/getAllApplicants", CONTROL.getAllApplicants, (req, res) => {});

//update applicant details
admin.post("/deleteApplicant", CONTROL.removeApplicant, (req, res) => {});

//accept applicants
admin.post("/acceptApplicant", CONTROL.acceptApplicant, (req, res) => {});

export { admin };
