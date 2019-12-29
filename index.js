const core = require('@actions/core');
const github = require('@actions/github');
const versionExtract = require('./version-extract');
const glob = require('glob-promise');


(async() => {
    let projectFile = core.getInput('csprojfile', { required: false });
    const githubToken = core.getInput("token", {required: true});

    if (projectFile == "") {
        const projectFiles = await glob('**/*.csproj');
        if (projectFiles.length == 0) {
            console.error("Failed to find a csproj file in this path and none provided.");
            process.exit(1);
        }
        projectFile = projectFiles[0];
    }

    var version = await versionExtract.extractFromFile(projectFile);
    console.info("Found version: "+version);

    const octokit = new github.GitHub(githubToken);
    const context = github.context;
    const repo = context.repo;

    await octokit.git.createRef({
        owner: repo.owner,
        repo: repo.repo,
        ref: "refs/tags/v"+ version,
        sha: context.sha,
    });

    core.setOutput("version", version);
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
