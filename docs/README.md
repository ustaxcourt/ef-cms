# EF-CMS Documentation

## Setup CircleCI CI/CD Pipeline

The CI/CD process is performed within CircleCI, which runs all tests and deploys the site to AWS. The process of configuring CircleCI, AWS, and SonarCloud is documented in [`SETUP.md`](SETUP.md).

## JavaScript API documentation

All JavaScript is marked up with [JSDoc](https://github.com/jsdoc3/jsdoc) comments, so documentation can be built by [installing JSDoc](https://github.com/jsdoc/jsdoc) and running `jsdoc -r .` locally.

## API documentation

The API is documented via Swagger, but right now it’s only available when the site is running in Docker. That can be reviewed at [`http://localhost:3000/v1/swagger`](http://localhost:3000/v1/swagger).

## HTML style guide

There is an HTML style guide, but right now it’s only available when the site is running in Docker. That can be found at [`http://localhost:1234/style-guide`](http://localhost:1234/style-guide).

## Visual style guide

A [visual style guide](docs/style-guide.pdf) — covering typography, colors, icons, buttons, form elements, etc. — is maintained as a PDF.

## User personas

All user personas are documented in [user-personas.pdf](docs/user-personas.pdf).

## Code review

At the end of each sprint, the vendor files a pull request back to the U.S. Tax Court’s repository. The review process used by the Court is documented in [`CODE_REVIEW.md`](docs/CODE_REVIEW.md).

## Accessibility testing

Per the requirements of the code review, all work must meet [Section 508 standards](https://www.section508.gov/), per [WCAG 2.0 AA](https://www.w3.org/TR/WCAG20/). The process by which that’s assured by developers is documented in [`ACCESSIBILITY.md`](ACCESSIBILITY.md).

## UX research

Flexion maintains [a collection of UX documentation](https://github.com/flexion/ef-cms/wiki/UX-Documentation), including [initial onsite user research](https://drive.google.com/open?id=1iapbWu6FFk6jWUdZyO_E4MUrwBpk0S9VCfhs_04yWJ0), [system user flows](https://www.lucidchart.com/invitations/accept/3548e4bf-2677-43ba-9707-c8ee797381eb), [user roles and permissions](https://docs.google.com/spreadsheets/d/1Hh7xMlnW87ospse50CWlwnGBrifrINeCyR2a8E--9wg/edit?usp=sharing), and a [content document](https://docs.google.com/spreadsheets/d/1lDbnSUwi85e-nQ7o1sNLpj2vzRFiTSeav5u3B3z_SZ4/edit?usp=sharing).

## Glossary of terminology

This project involves a great deal of specialized legal and court terminology. A [glossary of terminology](https://github.com/flexion/ef-cms/wiki/Glossary) is found on Flexion's wiki.
