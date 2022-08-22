
# Digital Platform multi-environment Template

* [Official documentation](https://github.customerlabs.com.au/pages/iagdigital/cdk-cosmos/intro)
* [Architecture and Design](https://github.customerlabs.com.au/pages/iagdigital/cdk-cosmos/dplat)

Latest Update:
* [README_UPDATE](https://github.com/iag-digital-platform/dig-platform-multienv-template/blob/main/README_UPDATE.md)

General questions: (Slack) #digital_platform_collab_space

# Why use this template?

This template provides a simple pattern of CDK and Cosmos constructs that allows you to 
deploy AWS resources with standard/vanilla/raw CDK.

This template provides the boilerplate for a CDK workload using Digital Platform patterns that will deploy using 
the self-hosted Github Actions Runners provided as part of Digital Platform CICD.

Other templates:
* [Blank-cosmos-v2-app](https://github.customerlabs.com.au/iagdigital/blank-cosmos-v2-app) This is a blank project for a new Cosmos v2 app
* [Scaffold-mfe](https://github.com/iag-digital-platform/scaffold-mfe) Template that allows quick bootstrapping of a micro frontend application using Module Federation.


# Getting started

Please create a ticket in [https://cafe.devops.iagcloud.net/](https://cafe.devops.iagcloud.net/) for a new repo with this template for your team.

If you do not have access you can [request access here](https://confluence.iag.com.au/display/DEVOPS/Digital+Platform+Access)

### Clone your code:

If you have issues due to new github policy you may need to create a *Personal access token* at https://github.com/settings/tokens

You may also need to configure your [proxy (Mac)pre proxy or (win/mac) cntlm](https://confluence.iag.com.au/display/DEVEX/Mac+Proxy+Guide+for+Developer+Minded+People)

```text
git config --global http.proxy http://localhost:8079
git clone https://[TOKEN]@github.com/iag-digital-platform/dig-platform-multienv-template.git
```

if you clone and unable to push you may need to update your token

```text
git remote set-url origin https://[TOKEN]@github.com/iag-digital-platform/dig-platform-multienv-template.git
```

# Create your github workflow

### Install

`yarn install`

### App config 

Change the name of your app in this file **app-config.ts** to something descriptive and commit.

### Build

build your dist files using the command `yarn run build:dist` and then
check that every environment has been built (dist/dev,dist/perf ...)

### Synth

run the command `npx cdk synth --lookups false` so it creates the required workflow *deploy.yml* 

After it completes you will get some text that looks like errors, but you can ignore if it starts with:

```Context lookups have been disabled.``` 

### Deploy

Push your changes to **deploy.yml** and your files to *main* branch and watch Github Actions deploy your code

Check actions are running with the url below. You can also run the action manually in a different branch

[https://github.com/iag-digital-platform/[YOUR_PROJECT]/actions](https://github.com/iag-digital-platform/dig-platform-multienv-template/actions)

# Check your deployment

### Static content

If everything went well you can quickly check if your content has deployed using the public urls below.
This is not your final public url. Please also read the **[Akamai](#akamai)** notes below.

(Set version to latest)

```text
https://asb.<STAGE>.digital.iag.com.au/mfe/<APP_NAME>/<VERSION>/
https://<STAGE>.insurance.digitalplatform.1925cloud.net/mfe/<APP_NAME>/<VERSION>/
Examples:
https://asb.dev.digital.iag.com.au/mfe/app-StaticWebContent/latest/
https://dev.insurance.digitalplatform.1925cloud.net/mfe/app-StaticWebContent/latest/
```

### Check your deployment in aws

Your code deploys to the dplat dev account, so you can log in and check Cloud Formation for your stack name.

login to [AWS](https://saml.iag.com.au/fim/sps/aws2faidp/saml20/logininitial?RequestBinding=HTTPPost&PartnerId=urn:amazon:webservices&NameIdFormat=Email&AllowCreate=false)
as dev for account (719674059873)

You may need to get access the dev accounts below.

```typescript
const digPlatDev = { account: "719674059873", region: "ap-southeast-2" };
```

### Check your API endpoint

* Log in to Developer account (719674059873).
* Go to services > Lambdas.
* Filter/search for the lambda for your app (APP_NAME).
* You should see one for every environment. click on one (dev).
* Click on **Configuration** on the horizontal tab.
* Click on **Triggers** on the vertical menu and this will show you the API endpoint you can test.

[More on info here architecture and design.](https://github.customerlabs.com.au/pages/iagdigital/cdk-cosmos/rest-api/architecture/overview/)

# Akamai

After you deploy your stuff, we'll need to point Akamai to it.

If you feel confident/don't-feel-confident-but-I-show-it-to-you-and-then-you're-confident you can make a PR here: https://github.com/iag-digital-platform/dig-platform-akamai-cdktf/blob/main/environments/environments.ts

Or you can just ask for our help in this channel. We need to know:

- the environment
- your workload/path
- the API endpoint
- if your workload is a container behind IRIS, we also need to know the port

If your workload hasn't been onboarded onto dplat yet, go to cafe.devops.iagcloud.net and open a Digital Platform general request

### Update API endpoint

In the file **App.tsx** change your API endpoint
```text
export function App() {
   const API = '/multienv-example/api/';
```

## Downstream apis

Downstream api references have been commented out for first deploy.
do a search for `downstreamRestApiNames` and uncomment the appropriate line/s

## MISC

check your `cdk-cosmos:githubActionRole` in cdk.context.json has been updated and does not contain the words *REPLACE-ME*

# ERRORS

`Please commit the updated workflow`

This means that the generated *deploy.yml* does not match the one in your repo.

Possible solution/issues:
* Generate you dist folder before generating your *deploy.yml* using *npm run build:deploy.yml*
* It could be that you don't have latest node modules. Delete node_modules and run *yarn*

# Useful commands

* *npm run build:deploy.yml* - build the dist folder and generate a new *deploy.yml* file
* *npm run build:dist* - build the dist folder for every environment
* *npm run build* - compile typescript to js
* *npm run build-app* - build the dist folder for every a specific $NODE_ENV
* *npm run synth-no-lookups* - generate a new *deploy.yml* (requires dist folder for every env)


