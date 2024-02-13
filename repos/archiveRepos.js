import { App } from "octokit";
import * as fs from 'node:fs';
const key = fs.readFileSync('.pem', 'utf-8'),
      org = '',
      repos = fs.readFileSync('inactive-repos.txt', 'utf-8').split(/\n/)

const app = new App({
  appId: '',
  privateKey: key,
});

let failures = []
let processed = 0;

const octokit = await app.getInstallationOctokit('');

let requests = repos.map((repo)=>{
  return octokit.rest.repos.update({
      owner: org,
      repo: repo,
      archived: true, // change flag to false to unarchive
  }).then(() => {
    processed++;
    console.log(`(Un)archived repo: ${repo}. Remaining: ${repos.length - processed}...`);
  }).catch((error)=>{
    console.log(`[ERROR] repo: ${repo} - ${error.response.data.message}`)
    failures.push(repo)
  })
})

Promise.all(requests).then(()=>{
  console.log(failures)
})
