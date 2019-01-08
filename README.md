# Electronic Filing / Case Management System

An as-yet-unnamed project by the [U.S. Tax Court](https://ustaxcourt.gov/), creating an open-source EF-CMS. Work began in October 2018, and can be seen [in the staging branch](https://github.com/ustaxcourt/ef-cms/tree/staging). For background, see [the RFQ to procure agile software development services](https://github.com/ustaxcourt/case-management-rfq).

## Building Everything
To run the same checks that run in Jenkins (except SonarQube) locally, using Docker containers, run the following:

`./build-all.sh`

This will run the lint, Shellcheck, audit, build, test, Cypress, Cerebral tests, Pa11y, etc. over all the components.

## Running / Verifing the Project via Docker

Assuming you have Docker installed, the following command will spin up a Docker container with the UI, API, local S3, local Dynamo, etc. all running inside it:

`./docker-run.sh`

You can access the UI at  http://localhost:1234
You can access the API at http://localhost:3000
You can access the DynamoDB shell at http://localhost:8000/shell
You can access the DynamoDB admin UI at http://localhost:8001
You can access S3 local at http://localhost:9000

## Running this project locally without Docker

The EF-CMS is comprised of two components: the API and the UI. Both must be run in order to function.

### Prerequisites
- Node v8.10.0
- npm 6.4.1

### Setup

Both the web-client and efcms-service share code that exists in the `shared` directory; therefore, before you can run either, you need to run `npm install` inside the `shared` directory.

- `cd shared && npm i`
- `cd ../web-client && npm i`
- `cd ../efcms-service && npm i`

#### Terminal A
- `cd web-client && npm start`

#### Terminal B
- `cd efcms-service && npm start`

### CI/CD Setup

For instructions on how to build the DevOps pipeline and deploy the software to AWS, see [SETUP.md](SETUP.md).

### Editor configuration

#### Atom.io

Install the following for best results:

- https://atom.io/packages/language-javascript-jsx
- https://atom.io/packages/language-groovy
- https://atom.io/packages/linter-eslint
- https://atom.io/packages/prettier-atom (enable ESLint and StyleLint integrations in settings)

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for additional information.

## Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
