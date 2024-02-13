import * as fs from 'node:fs';
import { App } from 'octokit';

const key = fs.readFileSync('', 'utf-8'),
      org = '';
      
const app = new App({
  appId: '',
  privateKey: key,
});

const octokit = await app.getInstallationOctokit(''); // provide app installation id

let teams = await octokit.paginate(octokit.rest.teams.list, {
    org: org,
});

let users = await octokit.paginate(octokit.rest.orgs.listMembers, {
    org: org,
});

let getTeamMembers = teams.map(async (team) => {
    return octokit.paginate(octokit.rest.teams.listMembersInOrg, {
        org: org,
        team_slug: team.slug,
    });
});

// process request and flatten arrays into single array;
let teamMembers = (await Promise.all(getTeamMembers)).flat(); 

let usersNotInTeams = users.filter(user => !teamMembers.some(member => member.login === user.login));

console.log(usersNotInTeams.map(user => user.login).join('\n'));
