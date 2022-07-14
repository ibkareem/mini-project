"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTROL = void 0;
const model_1 = require("../model/model");
const passwordHash_1 = require("../utils/passwordHash");
const tokenizer_1 = require("../utils/tokenizer");
const app_1 = require("../app");
const CONTROL = {
    async createAccount(body) {
        body.password = await passwordHash_1.PASSWORD.hash(body.password);
        body.token = await tokenizer_1.TOKEN.sign(body.squadNo);
        await model_1.DB.createDecadev(body);
        return body.token;
    },
    //signup dashboard authentcation control
    async dashboardAuth(req, res, next) {
        const token = req.query.auth;
        try {
            await tokenizer_1.TOKEN.verify(token);
            res.sendFile(`${app_1.publicPath}/decadev.html`);
        }
        catch (error) {
            next();
        }
    },
    //login authentication control --middleware
    async loginAuth(req, res, next) {
        const decadev = await model_1.DB.findOneDecadev(req.body.squadNo);
        if (!decadev) {
            res.json({ message: "Incorrect login" });
        }
        else {
            //checking the hash
            const password = await passwordHash_1.PASSWORD.compare(req.body.password, decadev.password);
            if (password) {
                //refresh and update user token
                const token = await tokenizer_1.TOKEN.sign(req.body.squadNo);
                res.json({ token: token }); //------> sending before updating for performance +
                model_1.DB.updateToken(decadev._id, token);
            }
            else {
                res.json({ message: "Incorrect login" });
            }
        }
    },
    //get and return decadev
    async getDecadev(req, res, next) {
        const authentication = await tokenizer_1.TOKEN.verify(req.params.token); //----->invalid token throws error
        //invalid token error caught by local variable(error)
        const decadev = await model_1.DB.findOneDecadev(authentication.id);
        res.json(decadev);
    },
    //confirm token for general api usage
    async updateDisplayPicture(req, res, next) {
        const authentication = await tokenizer_1.TOKEN.verify(req.params.token);
        // const imageBuffer = Buffer.alloc(12, req.body.data, "base64");--->using string,,,inneficient
        if (authentication)
            model_1.DB.updateImage(authentication.id, req.body.data);
        res.json({ message: "success" });
    },
    //save requests temp in DB
    async saveRequest(req, res, next) {
        console.log(req.body);
        model_1.DB.saveRequest(req.body);
        next();
    },
    //admin login auth
    async adminLoginAuth(req, res, next) {
        //admin access -------> important !!
        if ((req.body.email === "admin", req.body.password === "decagonAdmin")) {
            let token = await tokenizer_1.TOKEN.sign("admin");
            await model_1.DB.updateAdminToken(token);
            res.json({ token: token });
        }
        else {
        }
    },
    //admin dashboard auth
    async adminDashboardAuth(req, res, next) {
        const token = req.query.auth;
        try {
            await tokenizer_1.TOKEN.verify(token);
            res.sendFile(`${app_1.publicPath}/admin-dashboard.html`);
        }
        catch (error) {
            res.sendFile(`${app_1.publicPath}/admin-login.html`);
        }
    },
    //check new account request  notification
    async checkAccountRequest(req, res, next) {
        let requests = await model_1.DB.checkAccountRequest();
        requests = requests.filter((request) => request.position.length < 10);
        res.json({ requests });
    },
    //get all appliciants
    async getAllApplicants(req, res, next) {
        const applicants = await model_1.DB.getAllApplicants();
        return res.json({ applicants: applicants });
    },
    //remove applicant
    async removeApplicant(req, res, next) {
        //----insert----send email to applicant before deleting
        await model_1.DB.deleteApplicant(req.body.email);
        res.json({ message: "done" });
    },
    //accept applicant
    async acceptApplicant(req, res, next) {
        //delete applicants data from applicants DB and save in successfullDB
        await model_1.DB.deleteApplicant(req.body.data.emailAddress);
        await model_1.DB.acceptApplicant(req.body);
        res.json({ success });
    },
};
exports.CONTROL = CONTROL;
