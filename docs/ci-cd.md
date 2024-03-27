# An Overview of our CI/CD Pipeline

This part of the documentation is meant to give an overview of how our project is built, tested, and deployed using CircleCi, Github Actions, and Docker.

?> The **Flexion** CircleCI link can be found [here](https://app.circleci.com/pipelines/github/flexion/ef-cms).

?> The **Tax Court** CircleCI link can be found [here](https://app.circleci.com/pipelines/github/ustaxcourt/ef-cms).

## CircleCI

A majority of CI/CD pipeline is currently run in Circle CI.  Circle is hooked up to our repository and reads a [.circleci/config.yml](https://github.com/ustaxcourt/ef-cms/blob/staging/.circleci/config.yml) file to determine what to build and test.  This file can be broken down into 3 main sections:

- **commands** - these are used for abstracting away reusable pieces of setup that other **jobs** might need to invoke.  
- **jobs** - these are the smaller building blocks of a **workflow**.  For example, a single build workflow might have a job for linting, a job for testing, a job for e2e tests, etc.  Jobs are broken down into individual **steps**.
- **workflows** - allow us to create dependency graphs of **jobs**.  For example, when we merge a PR into `develop`, we need to make sure all of the test pass before we move onto the next job to `deploy` the code.  A workflow is broken down into multiple **jobs** which will all run in parallel unless a **requires** property is defined on the job.

In our Dawson project, we have defined two main workflows:

- **build-and-deploy** - this workflow is used for building, testing, and deploying our application
- **build-and-deploy-with-context** - this workflow is identical to the build-and-deploy workflow, except we use this workflow for the prod environment. Different AWS credentials are needed for prod, and these are setup in a different [CircleCI context](https://circleci.com/docs/2.0/contexts/) using a different AWS account.  

When someone commits to a branch in our repository, CircleCi will run this **build-and-deploy** workflow to start running all of the tests against that commit.  Notice that the jobs in the workflow have properties called **requires** and **filters**.

- **requires** - specifies the previous step which must pass before that step is run
- **filters** - specifies which branch this step should run in

For example, here is what our migrate job looks like:

```
- migrate:
    requires:
        - deploy
    filters:
    branches:
        only:
        - develop
        - irs
        - staging
        - test
        - experimental1
        - experimental2
        - experimental3
        - experimental4
        - experimental5
        - migration
```

This is saying the migrate job should only run directly after the deploy job is successful, and only on the defined branches.

### Executor 

When running a job in Circle, you have the option to run in either a VM or a container.

When you see the `machine` property on a job configuration, that means it's running directly in a Linux VM instance.  We use the `machine` executor when we need to build Docker containers during our build process.  Using docker_layer_caching will speed up the container we are building if it's already been built on that machine executor.

```
    machine:
      docker_layer_caching: true
```

The other executor is the `docker` executor.  When using this executor, you can actually string together multiple Docker containers which will all be accessible during your build. For example, our e2e-cypress-public job is a Docker executor which runs 3 separate Docker `images`.

```
e2e-cypress-public:
    docker:
        - image: $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:latest
        - image: amazon/dynamodb-local
            command: ['-jar', 'DynamoDBLocal.jar', '-inMemory']
        - image: elastic/elasticsearch:7.8.1
```

This first image is where job steps will execute and the other two images are used for hosting dynamodb and elasticsearch their own containers.  We use these pre-existing containers to speed up our build process instead of having to download and install dynamo and elasticsearch on every build ourselves.

### Permissions

In order to allow CircleCi to access and modify resources in our AWS account, we needed to set up and manage an IAM user with the correct permissions and store the access tokens as CircleCI environment variables.  The roles and policies for this CircleCI user are managed via Terraform. More specifically they are configured in this [iam/terraform/account-specific/main/circleci.tf](https://github.com/ustaxcourt/ef-cms/blob/staging/iam/terraform/account-specific/main/circle-ci.tf) file.

When an admin runs the `npm run deploy:account-specific` command, these permissions will be created and updated.  If you find there is a new resource that CircleCI needs access to modify, you will need to update this circle-ci.tf file and then re-run Terraform locally on your machine.

## Github Actions

Due to the high cost of CircleCI, there is an effort to try to transition our builds over to GitHub Actions since they are free for public repositories.  Right now we use GitHub Actions to run certain pre-merge checks, including linting the project, running the unit tests, and verifying some scripts.  The main reason we haven't switched everything over to GitHub Actions just yet is because a lot of our heavy lifting tasks, such as Pa11y and our integration tests require a lot of memory to run.

All of our actions are defined in [.github/workflows](https://github.com/ustaxcourt/ef-cms/tree/staging/.github/workflows).  There is a separate .yml file for each individual action.  Similar to CircleCi, an action is defined in a yml file and is broken down into various `steps`.  You can specify when the job runs (such as on pull_requests), which version of node to test on, which docker image (ubuntu-latest), and also run community run actions if needed.

Here is an example of our `test:client:unit` action:

```yml
#  client.yml
name: Node.js CI
on: [pull_request]
jobs:
  Client:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        ci_node_total: [4]
        ci_node_index: [0, 1, 2, 3]
    env:
      CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
      CI_NODE_INDEX: ${{ matrix.ci_node_index }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.11.0'
      - name: Collect Workflow Telemetry
        uses: runforesight/workflow-telemetry-action@v2
        with:
          comment_on_pr: false
      - name: Install Node Dependencies
        run: npm ci
      - name: Test Client Unit
        run: |
          export TESTFILES=$(npx ts-node split-tests-glob.ts -unit)
          NODE_INDEX=${{ matrix.ci_node_index }} npm run test:client:unit:ci
      - name: Rename coverage to shard coverage
        run: |
          mkdir -p coverage
          cp web-client/coverage/${{ matrix.ci_node_index }}/lcov.info coverage/lcov-${{ matrix.ci_node_index }}.info
          cp web-client/coverage/${{ matrix.ci_node_index }}/coverage-final.json coverage/coverage-${{ matrix.ci_node_index }}.json
      - uses: actions/upload-artifact@v3
        with:
          name: coverage-artifacts
          path: coverage
  check-coverage:
    runs-on: ubuntu-latest
    needs: [Client]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v3
        with:
          name: coverage-artifacts
          path: coverage
      - name: Process Coverage
        run: npx nyc report --check-coverage --branches 94.56 --functions 97 --lines 97 --statements 97 --reporter lcov --reporter text --reporter clover -t coverage
      - uses: geekyeggo/delete-artifact@v1
        with:
          name: coverage-artifacts
          failOnError: false
```

## Docker

We use Docker on our project to build some of the images we need in the CI/CD pipeline.  A majority of the Circle jobs must be run in a docker container, which means we needed to specify which image Circle should use.  We build the [Dockerfile](https://github.com/ustaxcourt/ef-cms/blob/staging/Dockerfile) and publish it to our AWS ecr repository whenever we need to update some of the dependencies.  The script [docker-to-erc.sh](https://github.com/ustaxcourt/ef-cms/blob/staging/docker-to-ecr.sh) can be use to build and publish the latest version of our CI image. This script will need to be run for both the Flexion and USTC accounts separately.

We also use a separate image called [Dockerfile](https://github.com/ustaxcourt/ef-cms/blob/staging/Dockerfile) for Circle deploy jobs since we don't care about Cypress when doing deploys.  This image is built and run using the machine executor in Circle, so you don't have to worry about manually building and deploying this image.

?> This documentation isn't meant to cover Docker in detail, so please read the [Docker Getting Started Guide](https://docs.docker.com/get-started/) if you want a more in-depth breakdown of Docker.  

The gist of Docker is you can build images using `docker build -t YOUR_IMAGE_TAG -f YOUR_DOCKERFILE .` which will basically build an image and provide it access to all of the files in the same working directory.  After you've built the image, you can run it via `docker run YOUR_IMAGE_TAG`.  Often, you need to pass additional flags to `docker run` such as the port `-p 8080:8080` flag to expose certain ports, or `-e "MY_ENV=hello"` to pass in environment variables for the container to use.  The docker definition file usually has a `CMD` line which states what command will execute when you run the container.  In Dawson, we often overwrite this cmd using `/bin/sh -c "npm run start"` command line option which will run whatever script we want inside the container.
