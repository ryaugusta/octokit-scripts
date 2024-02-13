import { App } from "octokit";
import * as fs from 'node:fs';
const key = fs.readFileSync('.pem', 'utf-8'),
      org = '';

const app = new App({
  appId: '',
  privateKey: key,
});

const octokit = await app.getInstallationOctokit('');;
const repos = await octokit.paginate(octokit.rest.repos.listForOrg, {
    org: org,
});

let processed = [];
let failures = [];  
console.log(`${repos.length} Total repos to delete`);
let requests = repos.map((repo) => {
    return octokit.rest.repos.delete({
        owner: org,
        repo: repo.name,
    }).then(() => {
        processed++;
        console.log(`Removing: ${repo.name}. Remaining: ${repos.length - processed}...`);
    }).catch((error) => {
        console.log(`[ERROR] repo: ${repo.name} - ${error.response.data.message}`);
        failures.push(repo.name);
    });
});

Promise.all(requests).then(()=>{
    console.log(`Processed ${processed.length} repos`)
    console.log(`Failed to process ${failures.length} repos`)
    console.log(failures)
})
