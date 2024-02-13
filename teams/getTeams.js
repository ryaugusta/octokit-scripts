import { App } from "octokit";
import * as fs from 'node:fs';
const key = fs.readFileSync('.pem', 'utf-8'),
      org = '';

const app = new App({
  appId: '',
  privateKey: key,
});

const octokit = await app.getInstallationOctokit('');

let getTeams = await octokit.paginate(octokit.rest.teams.list, {
    org: org,
});

getTeams.forEach((team)=>{
    console.log(team.name)
});
