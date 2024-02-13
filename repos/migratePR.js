const { Octokit } = require("@octokit/rest");

async function run() {
  const owner = ''
  const repo = ''
  const octokit = new Octokit({
      auth: process.env.GH_SOURCE_PAT, // or input your GitHub Personal Access token here in quotes: "<YOUR TOKEN>"
      // log: console
    })

  const pulls = await octokit.rest.pulls.list({
    owner: owner,
    repo: repo,
    state: 'open'
  })

  for(pr of pulls.data) {
    var title = pr.title.toString()
    var body = pr.body.toString()
    var head = pr.head.label.toString().split(`${owner}:`)[1]
    var base = pr.base.label.toString().split(`${owner}:`)[1]
    var prNumber = pr.number.toString()

    
    migratePullRequests(title, body, head, base)
    await new Promise(r => setTimeout(r, 10000));

  }

   // Single
  // var title = pulls.data[9].title.toString()
  // var body = pulls.data[9].body.toString()
  // var head = pulls.data[9].head.label.toString().split(`${owner}:`)[1]
  // var base = pulls.data[9].base.label.toString().split(`${owner}:`)[1]
  // migratePullRequests(title, body, head, base)
  // Single
}

async function migratePullRequests(title, body, head, base) {
  const owner = ''
  const repo = ''
  const octokit = new Octokit({
      auth: process.env.GH_TARGET_PAT, // or input your GitHub Personal Access token here in quotes: "<YOUR TOKEN>"
      // log: console
    })
  
  await octokit.rest.pulls.create({
      owner: owner,
      repo: repo,
      title: title,
      body: body,
      head: head,
      base: base
    });
}

run();
