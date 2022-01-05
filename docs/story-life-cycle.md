# Story Lifecycle

Before you assign a story to yourself, we need to talk about the typical lifecycle of our stories and bugs, including how they are created, assigned, worked on, tested, and completed.

## Github Issues

We use Github Issues to track all of our bugs and stories.  The Tax Court manages their own issues on the [Tax Court Fork](https://github.com/ustaxcourt/ef-cms/issues), and the issues worked on by Flexion are located in the [Flexion Fork](https://github.com/flexion/ef-cms/issues).

Why do we have two different places for issues?  The ultimate goal is for the Tax Court and Flexion to operate as *one team*, but in the early stages of the project we operated more as two separate teams with different concerns and priorities.  The Tax Court repo issues are usually focused on devops improvement, while Flexion's are focused on bug fixes and new features.

## Stories

Our stories start with the users of Dawson.  As new features are released, our UX team performs research and speaks with the users to gain insight into what could be improved, changed, added, or removed from our system to improve their working process.  We started the Dawson project with an initial set of features (MVP) that were needed for Court and external users to successfully do their jobs.  We still have a backlog of features that we are trying to implement alongside improvements to the current system.  The product owner is responsible for taking the suggestions from the UX team, engineers, and Court users to help craft user stories for the team to work on.  The product owner is also responsible for prioritizing which stories are most important to the Tax Court users.

?> We recommend installing the ZenHub extension in Chrome to get a better experience managing these issues when viewing the Flexion Github repo. [ZenHub Chrome Extension](https://chrome.google.com/webstore/detail/zenhub-for-github/ogcgkffhplmphkaahpmffcafajaocjbd?hl=en-US)

## Bugs

As users interact with our application sometimes they encounter bugs.  As bugs are reported, they are turned into a Github issue, groomed by the team, and prioritized by the product owner for developers to start fixing.  There are three levels of bug severity which we place onto bug Github issues via labels:

- High Severity
- Medium Severity
- Low Severity

The prioritizes are determined by the product owner depending on how much of an impact these bugs have on court users, petitioners, practitioners, etc.


## Refactoring Backlog

The Flexion team uses a [Trello board](https://trello.com/b/9tgrIFfA/ef-cms-opex-devex) for creating and managing refactoring related issues.  We will often create new Trello cards during our daily work as we find issues in our code base and deployment process.  We will later regroup as a team to prioritize these cards.  We strive to clean code up as we see issues in our codebase, but sometimes the refactoring might be a larger-scale system refactoring that needs to be tracked in one of the backlog refactoring cards.

!> If you come across overly complex pieces of code in our codebase or CI/CD pipeline related to your story changes, try to fix it as part of your story; otherwise, create a DevEx or OpEx backlog item for larger refactoring efforts.