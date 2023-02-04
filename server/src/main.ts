import path from "path";
import express, { Express, NextFunction, Request, response, Response } from "express";
import { serverInfo } from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./Contacts";
import { IContact } from "./Contacts";

const app: Express = express();

// responsible for parsing request bodies that contains json
app.use(express.json());

// serve compiled cod
app.use("/", 
  express.static(path.join(__dirname, "../../client/dist"))
)

app.use(function(inRequest : Request, inResponse: Response, inNext: NextFunction) {
  // cors config
  inResponse.header("Access-Control-Allow-Origin", "*");
  inResponse.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
  inNext();
})

app.get("/mailboxes", 
  async (inRequest : Request, inResponse : Response, inNext : NextFunction) => {
    try {
      const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
      const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
      inResponse.json(mailboxes);
    } catch (inError) {
      inResponse.send(inError);
    }
  }
)




