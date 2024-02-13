import * as fs from 'node:fs';
import { App } from 'octokit';

const ghecKey = fs.readFileSync('ghec-key.pem', 'utf-8'),
      emuKey = fs.readFileSync('emu-key.pem', 'utf-8'),
      teams = fs.readFileSync('teams.txt', 'utf-8').split('\n'),
      newOrg = ''  ,
      oldOrg = '';
      
const ghecApp = new App({
  appId: '', 
  privateKey: ghecKey,
});

const emuApp = new App({
  appId: '',
  privateKey: emuKey,
});

const ghecOctokit = await ghecApp.getInstallationOctokit(''); 
const emuOctokit = await emuApp.getInstallationOctokit(''); 

// reset perms.log file.
fs.writeFileSync('perms.log', '');
console.log('Log file reset.');

let failures = [];
let requests = teams.map(async (team) => {
  const repos = await ghecOctokit.paginate(ghecOctokit.rest.teams.listReposInOrg, {
    org: oldOrg,
    team_slug: team,
  });
  
  const promises = repos.map(async (repo) => {
    const perm = repo.permissions.admin ? 'admin' : (repo.permissions.push ? 'push' : 'pull');
    return emuOctokit.rest.teams.addOrUpdateRepoPermissionsInOrg({
      org: newOrg,
      team_slug: team,
      owner: newOrg,
      repo: repo.name,
      permission: perm,
    }).then(() => {
      // as each teams permission is updated, log it to perms.log
      fs.appendFileSync('perms.log', `${team} ${repo.name} ${perm}\n`);
    }).catch((error) => {
      console.log(`[ERROR]: ${team} ${repo.name} - ${error.response.data.message}`)
      failures.push(team)
    });
  });
  return Promise.all(promises);
});

Promise.all(requests).then(() => {
  if(failures.length > 0) {
    console.log('The following teams failed to update permissions:');
    console.log(failures);
  } else {
    console.log('All teams updated successfully');
  }
});
