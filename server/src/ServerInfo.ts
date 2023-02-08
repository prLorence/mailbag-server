const path = require("path");
const fs  = require("fs");

export let serverInfo : IServerInfo;

export interface IServerInfo {
  smtp: {
    host: string,
    port: number,
    auth: {
      user: string,
      pass: string
    }
  },
  imap: {
    host: string,
    port: number,
    auth: {
      user: string,
      pass: string
    }
  }
}

const rawInfo: string = fs.readFileSync(path.join(__dirname, "../serverInfo.json"));
serverInfo = JSON.parse(rawInfo);
console.log("ServerInfo: ", serverInfo);