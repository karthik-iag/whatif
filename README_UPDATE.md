## Environments update!

In addition to `dev` and `tst`, `stub`, `sit`, and `perf` have been provisioned in Akamai

> Note: `tst` is only temporary - if you haven't deployed to this now, maybe don't - as it won't stick around

For those already happily updated to Cosmos v0.6.0, there's just a few steps to target them.

> Note: Please use this template as an example

You will need to change your app name in the `AppStage` construct in `lib/app-stage` to avoid overwriting the default stack.

- Upgrade to Cosmos v0.6.1

Only breaking change is in the use of the `dplatEnv()` helper function. Instead of using it like this:

```javascript
// lib/appstage.ts:
const apiStack = new ApiStack(this, `${appName}ApiStack`, {
  env: dplatEnv(this, id),
});

const staticContentStack = new StaticContentStack(this, `${appName}StaticStack`, {
  env: dplatEnv(this, id, { staticContent: true }),
});
```

Use it like this:

```javascript
// lib/appstage.ts:
const apiStack = new ApiStack(this, `${appName}ApiStack`, {
  env: dplatEnv(this, id).default,
});

const staticContentStack = new StaticContentStack(this, `${appName}StaticStack`, {
  env: dplatEnv(this, id).static,
});
```

You can also get the target bucket id using this same function:

```javascript
new StaticWebContent(this, 'MultienvSite', {
  name: 'multienv-app',
  targetBucketId: dplatEnv(this).targetBucketId,
  source: join(__dirname, `../dist/${stageName.toLowerCase()}`),
});
```

There is also another convenience function to grab the stage your stack is in:

```javascript
const stageName = getStageName(this);
```

And an enum `DplatEnvName` to get the correct stage names that map to Digital Platform stages. Use it in `/bin/main.ts` when giving IDs to your stages:

```javascript
ghaCdkPipeline.addStageWithGitHubOptions(new AppStage(app, DplatEnvName.DEV), {
  gitHubEnvironment: 'Dev',
});

ghaCdkPipeline.addStageWithGitHubOptions(new AppStage(app, DplatEnvName.SIT), {
  gitHubEnvironment: 'Sit',
});
```

More complete documentation is on its way. Please ask in #digital_platform_collab_space for help.

> Note: If you're using the build-static-content-for-each-env method similar to this repo, the gha-pipeline would only create properly if I'd also built the apps locally into their environment folders, even if all those static files are in the .gitignore. Not quite sure what's going on there.

## A note on downstream apis

You will have to comment out downstream api references that reference apis in the same repo like this for new environments:

```javascript
restApi.addEndpoint(
  'MultienvEndpoint2',
  new EndpointWithNodejsLambdaProps({
    httpMethod: HttpMethod.GET,
    path: '/hello2',
    function: {
      entry: join(__dirname, '../lambda/bff2/app.ts'),
      handler: 'handler',
    },
    attachAuthorizer: false,
    secretNames: ['Multienv'],
    // downstreamRestApiNames: [expRestApi.node.id],
  })
);
```

This is the ol' chicken and egg situation. It can't look up an api you haven't deployed yet. We in the Digital Platform squad loathe both chickens and eggs and will do something about this.

You could do this conditionally on stage name so as not to change already-deployed envs.

## Akamai

After you deploy your stuff, we'll need to point Akamai to it.

If you feel confident/don't-feel-confident-but-I-show-it-to-you-and-then-you're-confident you can make a PR here: https://github.com/iag-digital-platform/dig-platform-akamai-cdktf/blob/main/environments/environments.ts

Or you can just ask for our help in this channel. We need to know:

- the environment
- your workload/path
- the enpoint
- if your workload is a container behind IRIS, we also need to know the port

If you workload hasn't been onboarded onto dplat yet, go to cafe.devops.iagcloud.net and open a Digital Platform general request
