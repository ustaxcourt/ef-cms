# Electronic Filing / Case Management System

An as-yet-unnamed project by the [U.S. Tax Court](https://ustaxcourt.gov/), creating an open-source EF-CMS. Work began in October 2018, and can be seen [in the staging branch](https://github.com/ustaxcourt/ef-cms/tree/staging). For background, see [the RFQ to procure agile software development services](https://github.com/ustaxcourt/case-management-rfq).

## Running this project locally

The EF-CMS is comprised of two components: the API and the UI. Each must be run in order to function.

### UI (Terminal A)

#### Setup

- `cd web-client`
- `npm i`

#### Running

- `cd web-client`
- `npm start`

### API (Terminal B)

#### Setup

- `cd efcms-service`
- `npm i`
- `npm run install:dynamodb`

#### Running

- `cd efcms-service`
- `npm start`

## CI/CD Setup

Please look at the [SETUP.md](SETUP.md).

## Editor configuration

### Atom.io

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
