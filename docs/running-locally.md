# Running Dawson Locally

So by now, hopefully you've logged in to a deployed Dawson environment, played around uploading a petition as the *petitioner1@example.com* user, and maybe even served that petition as the *petitionsclerk2@example.com* user.  Now it's time to figure out how you can run this application locally so that you can start contributing to the project.

## Prerequisites

!> We try to update versions of our software as often as we can, so double check with the team to verify these docs are accurate.

### Git

Download and install [git](https://git-scm.com/downloads).  We use GitHub as our source control.

After installing git, be sure to clone the project locally:


`git clone git@github.com:flexion/ef-cms.git`


### Node v14.16.0

All of our application code is built using Javascript: 

- Our frontend is written React, Cerebral, and bundled using webpack.
- Our backend APIs are written using express and a serverless wrapper.

Because of this, you will need to make sure you node and npm installed locked to the following versions:
    - Node v14.16.0
    - npm v6.14.11

As of 03/17/22, AWS Lambda only supports up to [`nodejs14.x`](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)

### Java 11+ 

You will need Java installed in order to run **[elasticsearch](https://www.elastic.co/)** and **[dynamodb](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html)** locally on your machine.  Grabbing the latest version of Java JDK should work fine.

### JQ

JQ is a tool used for parsing JSON in the command line.  We use JQ a lot in various deployment scripts.

`brew install jq`

### Shellcheck

Shellcheck is a tool we run locally against our .sh scripts to check for potential issues and keep the styling consistent.  You can install it with brew:

`brew install shellcheck`


### AWS CLI

The AWS CLI is again used for a majority of our deployment scripts.  You can follow this [tutorial](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) to get the AWS CLI v2 installed on your laptop.

### Terraform

We recommend you install a tool called [tfenv](https://github.com/tfutils/tfenv) which can be used to easily switch your terraform version.  

```bash
brew install tfenv
tfenv install 1.1.0
tfenv use 1.1.0
```

!> Before running terraform on your workspace, double check you are on the correct version.

### Circleci
Since we use circle ci in our CI/CD process, we using a husky pre-commit to validate our config file.  Because of this, you'll need to install this circleci package.

```bash
brew install circleci
```

## Getting Running

All of the scripts needed to run this project should be outlined in our [package.json](https://github.com/ustaxcourt/ef-cms/blob/staging/package.json#L162).  I'd recommend at least reading through some of these scripts because you will be using a lot of them as you advanced through learning this application.  But, so as not to overwhelm you, let's just talk about the most important ones.

### Checkout Develop

You'd want to make sure you are on the `ustaxcourt/staging` branch before you install the npm dependencies or try to start the services.


### Install the NPM Depedencies

All of the applications dependencies are managed via our `package.json` and `package-lock.json` files and are installed using `npm`.  You will first need to install of our dependencies by running the following:

`npm install`


### 🏃 Starting the Services

Once you've installed the dependencies, you should be able to run the npm scripts to start up the API, private UI, and public UI.  We recommend you have three separate terminals open and run each of the following commands in a separate terminal:

- `npm run start:client` (starts the private UI)
- `npm run start:public` (starts the public UI)
- `npm run start:api` (starts the private API and public API)

Once you've started your services locally, you should be able to access them here:

- [http://localhost:1234](http://localhost:1234) (private UI)
- [http://localhost:5678](http://localhost:5678) (public UI)

If everything is working fine, you should see the private UI hosted on [http://localhost:1234](http://localhost:1234).  Use one of the mock logins documented below to login.

![Mock Login Page](./images/mock-login.png)

## How to Login Locally

Now that you have your application running locally, we recommend that you try to login with some of the mock user accounts we have set up locally.  All of these users are defined in the [users.json](https://github.com/ustaxcourt/ef-cms/blob/staging/web-api/storage/fixtures/seed/users.json) file, and also in our [efcms-local.json](https://github.com/ustaxcourt/ef-cms/blob/staging/web-api/storage/fixtures/seed/efcms-local.json) file which contains all of our dynamodb seed data.

Open a browser to [http://localhost:1234](http://localhost:1234) and enter one of the following mock user emails.

?> There is no password required for logins during local development


```txt
petitioner@example.com
privatePractitioner@example.com
irsPractitioner@example.com
irsSuperuser@example.com
adc@example.com
admissionsclerk@example.com
clerkofcourt@example.com
docketclerk@example.com
docketclerk1@example.com
floater@example.com
general@example.com
petitionsclerk@example.com
petitionsclerk1@example.com
reportersOffice@example.com
trialclerk@example.com
judge.ashford@example.com
ashfordsChambers@example.com
judge.buch@example.com
buchsChambers@example.com
stjudge.carluzzo@example.com
carluzzosChambers@example.com
judge.cohen@example.com
cohensChambers@example.com
judge.colvin@example.com
colvinsChambers@example.com
```

## Running via Docker

!> no developer uses this approach, so it may have bugs running the entire app via this docker command.

If needed, you can also try to run the entire project from a single docker container.
Once [you have Docker installed](https://docs.docker.com/install/), the following command will spin up a Docker container with the UI, API, local S3, local Dynamo, etc. all running inside it.  No one currently uses this approach when developing on this project since it is often slower and more error prone compared to running Dawson locally.

```sh
./docker-run.sh
```

Within Docker, you should allocate 2+ CPUs, 8+ GB of RAM, and 4+ GB of swap. With fewer resources, the software is likely to fail to run with errors that don’t make it obvious what the problem is.


## Troubleshooting

Hopefully everything will work fine, but if you have issues logging in, double check that your API didn't throw errors when trying to initialize.  Check your network tab or browser console for any errors when trying to access the localhost:4000 API.  Also verify you are on the correct branch. `ustaxcourt/staging` is recommended.
