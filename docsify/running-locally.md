So by now, hopefully now you've logged in to a deployed Dawson environment and played around uploading a petition as the *petitioner1@example.com* user and maybe even served that petition as the *petitionsclerk2@example.com* user.  Now it's time to figure out how you can run this application locally so that you can start contributing to the project.

## Prerequisites


### Node v14.16.0

All of our application code is built using Javascript: 
    - Our frontend is written React, Cerebral, and bundled using webpack.
    - Our backend APIs are written using express and a serverless wrapper.

Because of this, you will need to make sure you node and npm installed locked to the following versions:
    - Node v14.16.0
    - npm v6.14.11

### Java 11+ 

You will need Java installed in order to run **[elasticsearch](https://www.elastic.co/)** and **[dynamodb](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html)** locally on your machine.

### Jq

JQ is a tool used for parsing JSON in the command line.  We use JQ a lot in our various deployment scripts.

`brew install jq`

### AWS CLI

The AWS cli is again used for a majority of our deployment scripts.  You can follow this [tutorial](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) to get the aws cli v2 installed on your laptop.

### Terraform

We recommend you install a tool called [tfenv](https://github.com/tfutils/tfenv) which can be used to easily switch your terraform version.  

`brew install tfenv`

`tfenv install 1.1.0`

`tfenv use 1.1.0`

!> It is critical you have the right version of terraform set before you try to deploy to AWS from your laptop


## Getting Running

All of the scripts needed to run this project should be outlined in our [package.json](https://github.com/ustaxcourt/ef-cms/blob/staging/package.json#L162).  I'd recommend at least reading through some of these scripts because you will be using a lot of them as you advanced through learning this application.  But, so not to overwhelm you, let's just talk about the most important.


### Install the NPM Depedencies

All of the applications dependencies are managed via our `package.json` and `package-lock.json` files and are installed using `npm`.  You will first need to install of our dependencies by running the following:

`npm install`







##### Setup

- Install the JDK from https://www.oracle.com/java/technologies/javase-jdk13-downloads.html
For ClamAV, macOS users can do the following:
*(Note: The following steps are unnecessary as clamav is disabled.)*
- ~~`brew install clamav`~~
- ~~`cp /usr/local/etc/clamav/freshclam.conf.sample /usr/local/etc/clamav/freshclam.conf`~~
- ~~`sed -ie 's/^Example/#Example/g' /usr/local/etc/clamav/freshclam.conf` (comments out `Example` in the `freshclam.conf` file)~~
- Installing `jq`
  - `brew install jq` for macOS users or visit https://stedolan.github.io/jq/download/

Both the front-end (`/web-client`) and API (`/web-api`) share code that exists in `/shared`. Before you can run either, you need to run `npm install` inside the top-level directory.

- `npm i`

###### Terminal A

- `npm run start:api`

Other start commands:

- Run `cd web-client && npm run start:client:no-scanner` to start the UI without Dynamsoft (or if you don't have a scanner)
- Run `npm run start:public` to start the UI for the public access portion of the site

###### Terminal B

- `npm run start:client`

#### Login and test users

There are two login mechanisms available — the legacy mock login system, and a new one that emulates AWS Cognito.

##### Mock login

You can log in using the following accounts.

###### External Users

```txt
petitioner@example.com
privatePractitioner@example.com
privatePractitioner1 - privatePractitioner4@example.com
irsPractitioner@example.com
irsPractitioner1 - irsPractitioner4@example.com
irsSuperuser@example.com
```

###### Internal Users

```txt
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

No password is required.
