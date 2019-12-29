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
    const ref = "tags/v"+version;

    await octokit.git.getRef({
        owner: repo.owner,
        repo: repo.repo,
        ref: ref
    }).then(_ => {
        throw new Error("Tag already exists.");
    }, err => {
        if (err.name == 'HttpError' && err.status == 404) {
            return;
        }

        throw err;
    });

    await octokit.git.createRef({
        owner: repo.owner,
        repo: repo.repo,
        ref: ref,
        sha: context.sha,
    });

    core.setOutput("version", version);
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
