const path = require("path");
const fs  = require("fs");

export let serverInfo : IServerInfo;
const rawInfo : string = fs.readFileSync(path.join(__dirname, "../serverInfo.json"));

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

serverInfo = JSON.parse(rawInfo)
