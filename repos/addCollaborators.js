import { Octokit } from "octokit";

const octokit = new Octokit({
    auth: ''
});

const org = '';

let getRepos = await octokit.paginate(octokit.rest.repos.listForOrg, {
    org: org,
});

let failures = [];
let requests = getRepos.map((repo => {
    return octokit.rest.teams.addOrUpdateRepoPermissionsInOrg({
        org: org,
        team_slug: '',
        owner: org,
        repo: repo.name,
        permission: 'push'
      }).then(() => {
        console.log(`Added team '' to ${repo.name}`);
      }).catch((error) => {
        failures.push(repo);
        console.log(`Error adding team '' to ${repo.name}: ${error.response.data.message}`);
      });
}));

Promise.all(requests).then(() => {
    console.log(failures);
});
