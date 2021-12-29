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

### Environment Shuffle

This process is to merge changes from the Court into our Flexion fork, and also to create batch PRs if the batch is ready.  Please view the [Environment Shuffle](pr-workflow?id=environment-shuffle) part of the documentation for more information.

### Dependency Updates

Similar to [Environment Shuffle](team-process?id=environment-shuffle), every week we rotate responsibility for updating dependencies. As an open-source project, we rely on external libraries which get updates frequently. These include JavaScript Library Updates and Infrastructure as Code Libraries as described below. As of 12/21/21, we are basing these changes off of the `flexion/develop` branch. 

> After changes are made to any dependencies, deploy to an exp environment to verify that all tests pass!
  > * If terraform needs to be updated, deploy locally to an exp environment first. 

#### JavaScript Library Updates

`npm update`: Update to current minor versions of all libraries. These shouldn't include any breaking changes, but still might, so it's best to verify with smoke tests in AWS.

`npm outdated`: Informs us of major version updates that we need to update manually. Often there are breaking API changes that require refactoring.

`npm audit`: Informs us of known security vulnerabilities. If transitive dependencies are vulnerable, use the resolutions block in `package.json` to specify version overrides. 
If dependencies have no patch, replace it with an alternative, or wait for the library to be patched.

#### Infrastructure as Code Libraries

`Terraform`: check for updates on the Terraform site. The Terraform version can be changed with a global find/replace.
  * If there is a new version of Terraform, update all version references in the project and push to to an experimental environment to allow CircleCI to verify everything is working. 
  * Be sure to deploy the migration infrastructure and run a migration as well.
  * Once verification is complete, you will need to rebuild the docker images that use Terraform and push them to ECS.

`Docker`: Update docker base image version if applicable.
