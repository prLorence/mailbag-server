"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ServerInfo_1 = require("./ServerInfo");
const IMAP = __importStar(require("./IMAP"));
const SMTP = __importStar(require("./SMTP"));
const Contacts = __importStar(require("./Contacts"));
const app = (0, express_1.default)();
// responsible for parsing request bodies that contains json
app.use(express_1.default.json());
// serve compiled cod
// app.use("/", 
//   express.static(path.join(__dirname, "../../client/dist"))
// )
app.use(function (inRequest, inResponse, inNext) {
    // cors config
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    inNext();
});
// ! endpoints
// visiting a site triggers a GET method, lists all mailboxes
app.get("/mailboxes", (inRequest, inResponse, inNext) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        const mailboxes = yield imapWorker.listMailboxes();
        inResponse.json(mailboxes);
    }
    catch (inError) {
        inResponse.send(inError);
    }
}));
// gets all messages
app.get("/mailboxes/:mailbox", (inRequest, inResponse, inNext) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        const messages = yield imapWorker.listMessages({
            mailbox: inRequest.params.mailbox
        });
        inResponse.json(messages);
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
// get message inside a mailbox with id
app.get("/messages/:mailbox/:id", (inRequest, inResponse, inNext) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        const messageBody = yield imapWorker.getMessageBody({
            mailbox: inRequest.params.mailbox,
            id: parseInt(inRequest.params.id, 10)
        });
        inResponse.send(messageBody);
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
// delete message in mailbox with id
app.delete("/messages/:mailbox/:id", (inRequest, inResponse, inNext) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        yield imapWorker.deleteMessage({
            mailbox: inRequest.params.mailbox,
            id: parseInt(inRequest.params.id, 10)
        });
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
// create message in message
app.post("/messages", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const smtpWorker = new SMTP.Worker(ServerInfo_1.serverInfo);
        yield smtpWorker.sendMessage(inRequest.body);
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
// get all contacts
app.get("/contacts", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactsWorker = new Contacts.Worker();
        const contacts = yield contactsWorker.listContacts();
        inResponse.json(contacts);
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
// add a contact
app.post("/contacts", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactsWorker = new Contacts.Worker();
        const contact = yield contactsWorker.addContact(inRequest.body);
        inResponse.json(contact);
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
// delete a contact
app.post("/contacts/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactsWorker = new Contacts.Worker();
        contactsWorker.deleteContact(inRequest.params.id);
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.send("error");
    }
}));
