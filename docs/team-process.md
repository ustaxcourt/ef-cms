# Team Process

Now that you've logged in and played around with our Dawson system a bit on a deployed environment, let's talk about our team process and what is expected from our fellow teammates.  This part of the documentation should help members get on the same page when it comes to the soft-skills required to work as a well-oiled agile machine.

## 🤝🏿 Working Agreement

We have talked about writing some form of working agreement so team members have a common understanding of what is expected from them during their daily work.  Great teams strive for open communication, safe spaces to speak their mind, and continous improvement in process.  Embracing some of the following ideologies will help grow and sustain a healthy team.

### Flexion Fundamentals

For Flexioneers, remember to read and apply the flexion fundamentals to your daily work.  Doing so will help you write higher quality software, and it should help you grow as a person in general.

[https://flexion.us/flexion-fundamentals/](http://fundamentals.flexion.us/)

### Pair / Mob Programming

A majority of stories and bug we work on should be tackled using pair or mob programming.  The reason we utilize this type of programming is because it produces higher quality software, helps developers find defects in a shorter feedback loop, increases creativity, and strengthens knowledge sharing.  Remember, **cooperation** and **communication** are keys to *success*. 

> Two minds are better than one.

### Quality over Speed

It has been made clear many times by the Court that producing high quality software (low defects, easy to manage and understand) is far more important than quickly delivering features.  All code should be covered with all forms of testing (unit, integration, smoke testing), we should be spending 20% of our sprints refactoring code, documentation should always be written or updated, and stories should not be considered done until after meeting our Definition of Done criteria.

> 20% of our time should be spent refactoring

## Agile Meetings

We strive to be keep our project as Agile as possible.  This means that every sprint we follow the typical scrum ceremonies to allow our team to plan for the upcoming work without planning too far ahead.  If you are already an expert in Agile, you may want to skim over this section, but since every team encorporates Agile processses their own way it might be worth a read through.

### Daily Standup

Since we strive to work in pairs and mobs, our stand ups focus more on group goals.  Every morning we meet to talk about our goals for our current sprint and also talk about our story goals for the day.  We setup **parking lot** items to give an opportunity to discuss any important topics that the entire team should be aware of.  We will often give small demos of story / bug progress to the Tax Court.

### Sprint Planning 

TODO

### Sprint Review Prep

TODO

### Sprint Review

TODO

### Refactoring Backlog

TODO

## Tech Rotations

Each week we rotate a few of the routine process and maintenance chores between team members. This is tracked using a schedule posted to the USTC out of office calendar.

### Dependency Updates

Every week we rotate responsibility for updating dependencies. As an open-source project, we rely on external libraries which get updates frequently. These include JavaScript Library Updates and Infrastructure as Code Libraries as described below. Follow the [PR workflow](./pr-workflow.md) like any other change. 

> After changes are made to any dependencies, deploy to an exp environment to verify that all tests pass!
  > * If terraform needs to be updated, deploy locally to an exp environment first. 

#### Library Update Steps

1. `npm update`: Update to current minor versions of all libraries. These shouldn't include any breaking changes, but still might, so it's best to verify with smoke tests in AWS.

2. `npm outdated`: Informs us of major version updates that we need to update manually. Often there are breaking API changes that require refactoring.

3. `npm audit`: Informs us of known security vulnerabilities. If transitive dependencies are vulnerable, use the resolutions block in `package.json` to specify version overrides. 
If dependencies have no patch, replace it with an alternative, or wait for the library to be patched.

    NOTE: If any npm packages are updated, update the node cache version in the circle config. You can do this by searching within `config.yml` for vX-npm and vX-cypress where X is the current version of the cache key, then increment the version found.

3. `terraform`: check for a newer version on the [Terraform site](https://www.terraform.io/downloads).

    - Once verification is complete, you will need to increment the docker image version being used in `.circleci/config.yml` and publish a docker image tagged with the incremented version number to ECR.

4. `docker`: Update [docker base image](https://hub.docker.com/r/cypress/base/tags?page=1&name=14.) if an update is available for the current node version the project is using.

#### Caveats
- `cypress`: Do not upgrade past 8.5.0 as anything above that version will cause the "Failed to connect to bus" [error](https://trello.com/c/iuq0gJ6P/1008-ci-error-failed-to-connect-to-the-bus). 

- `@fortawesome/free-solid-svg-icons`: v6.0.0 caused a regression with faThumbtack so it is not importable. [Github issue](https://github.com/FortAwesome/Font-Awesome/issues/18661) Leaving both this package and `fortawesome/free-regular-svg-icons` at v5.15.4 until this is patched.

- `@fortawesome/fontawesome-svg-core`: Temporarily set to only accept bugfix updates. Upgrading from v1.2.36 to v1.3.0 causes icon sizing issues. Since it was released 2 days ago as of writing this, seems worth waiting for a patch, similar to the other @fortawesome packages (Update: Still causing issues as of 03/04 [related GitHub issue](https://github.com/FortAwesome/Font-Awesome/issues/18663)).

- `puppeteer-core` within `web-api/runtimes/puppeteer`: locked to v13.0.1 because that's the highest version that `chrome-aws-lambda` [supports](https://github.com/alixaxel/chrome-aws-lambda/issues/254) at the moment. Note that this package can be updated in the main package.json.

- `pdfjs-dist`: temporarily locked to 2.12.313 as v2.13.216 causes issues with pdf rendering in cypress tests

#### Validating Updates
-  After changes are made to any dependencies, deploy to an exp environment to verify that all tests pass!
    - Be sure the deploy runs a migration to verify the updates do not affect the migration workflow.

