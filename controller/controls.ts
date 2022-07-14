import { NextFunction, Request, Response } from "express";
import { DB } from "../model/model";
import { PASSWORD } from "../utils/passwordHash";
import { TOKEN } from "../utils/tokenizer";
import { publicPath } from "../app";

const CONTROL = {
  async createAccount(body: any) {
    body.password = await PASSWORD.hash(body.password);
    body.token = await TOKEN.sign(body.squadNo);
    await DB.createDecadev(body);
    return body.token;
  },

  //signup dashboard authentcation control
  async dashboardAuth(req: Request, res: Response, next: NextFunction) {
    const token: any = req.query.auth;
    try {
      await TOKEN.verify(token);
      res.sendFile(`${publicPath}/decadev.html`);
    } catch (error) {
      next();
    }
  },

  //login authentication control --middleware
  async loginAuth(req: Request, res: Response, next: NextFunction) {
    const decadev = await DB.findOneDecadev(req.body.squadNo);
    if (!decadev) {
      res.json({ message: "Incorrect login" });
    } else {
      //checking the hash
      const password = await PASSWORD.compare(
        req.body.password,
        decadev.password
      );
      if (password) {
        //refresh and update user token
        const token = await TOKEN.sign(req.body.squadNo);
        res.json({ token: token }); //------> sending before updating for performance +
        DB.updateToken(decadev._id, token);
      } else {
        res.json({ message: "Incorrect login" });
      }
    }
  },

  //get and return decadev
  async getDecadev(req: Request, res: Response, next: NextFunction) {
    const authentication: any = await TOKEN.verify(req.params.token); //----->invalid token throws error
    //invalid token error caught by local variable(error)
    const decadev = await DB.findOneDecadev(authentication.id);
    res.json(decadev);
  },

  //confirm token for general api usage
  async updateDisplayPicture(req: Request, res: Response, next: NextFunction) {
    const authentication: any = await TOKEN.verify(req.params.token);
    // const imageBuffer = Buffer.alloc(12, req.body.data, "base64");--->using string,,,inneficient
    if (authentication) DB.updateImage(authentication.id, req.body.data);
    res.json({ message: "success" });
  },

  //save requests temp in DB
  async saveRequest(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    DB.saveRequest(req.body);
    next();
  },

  //admin login auth
  async adminLoginAuth(req: Request, res: Response, next: NextFunction) {
    //admin access -------> important !!
    if ((req.body.email === "admin", req.body.password === "decagonAdmin")) {
      let token = await TOKEN.sign("admin");
      await DB.updateAdminToken(token);
      res.json({ token: token });
    } else {
    }
  },

  //admin dashboard auth
  async adminDashboardAuth(req: Request, res: Response, next: NextFunction) {
    const token: any = req.query.auth;
    try {
      await TOKEN.verify(token);
      res.sendFile(`${publicPath}/admin-dashboard.html`);
    } catch (error) {
      res.sendFile(`${publicPath}/admin-login.html`);
    }
  },

  //check new account request  notification
  async checkAccountRequest(req: Request, res: Response, next: NextFunction) {
    let requests = await DB.checkAccountRequest();
    requests = requests.filter((request) => request.position.length < 10);
    res.json({ requests });
  },

  //get all appliciants
  async getAllApplicants(req: Request, res: Response, next: NextFunction) {
    const applicants = await DB.getAllApplicants();
    return res.json({ applicants: applicants });
  },

  //remove applicant
  async removeApplicant(req: Request, res: Response, next: NextFunction) {
    //----insert----send email to applicant before deleting
    await DB.deleteApplicant(req.body.email);
    res.json({ message: "done" });
  },

  //accept applicant
  async acceptApplicant(req: Request, res: Response, next: NextFunction) {
    //delete applicants data from applicants DB and save in successfullDB
    await DB.deleteApplicant(req.body.data.emailAddress);
    await DB.acceptApplicant(req.body);
    res.json({ message: "success" });
  },
};

export { CONTROL };
