import path, { parse } from "path";
import express, { Express, NextFunction, Request, response, Response } from "express";
import { serverInfo } from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./Contacts";
import { IContact } from "./Contacts";
import { inflateRaw } from "zlib";

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

// ! endpoints

// visiting a site triggers a GET method, lists all mailboxes
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

// gets all messages
app.get("/mailboxes/:mailbox", 
    async (inRequest: Request, inResponse: Response, inNext: NextFunction) => {
      try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        const messages: IMAP.IMessage[] = await imapWorker.listMessages({
          mailbox: inRequest.params.mailbox
        });
        inResponse.json(messages);
      } catch (inError) {
        inResponse.send("error");
      }
  }
) 

// get message inside a mailbox with id
app.get("/messages/:mailbox/:id", 
    async (inRequest: Request, inResponse: Response, inNext: NextFunction) => {
      try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        const messageBody: string | undefined = await imapWorker.getMessageBody({
          mailbox: inRequest.params.mailbox,
          id: parseInt(inRequest.params.id, 10)
        })
        inResponse.send(messageBody);
      } catch(inError) {
        inResponse.send("error");
      }
    }
)

// delete message in mailbox with id
app.delete("/messages/:mailbox/:id", 
    async (inRequest: Request, inResponse: Response, inNext: NextFunction) => {
      try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        await imapWorker.deleteMessage({
          mailbox: inRequest.params.mailbox,
          id: parseInt(inRequest.params.id, 10)
        });
        inResponse.send("ok");
      } catch (inError) {
        inResponse.send("error");
      }
    }
) 

// create message in message
app.post("/messages", 
    async (inRequest: Request, inResponse: Response) => {
      try {
        const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
        await smtpWorker.sendMessage(inRequest.body);
        inResponse.send("ok");
      } catch (inError) {
      inResponse.send("error");
      }
    }
);
 


