### Refactoring Guidelines
**How do we recognize that an item represents tech-debt?**
- We’ve identified something in the past that could be done to make engineering better
Items deferred for a later point due to having to get a product out the door or due to story expansion and scope creep.

**How do we know when to refactor in a story vs. add to the DevEx / OpEx backlog?**
 - Mob working on the story should research complexity and time required. 
 - Using this research, the mob would then determine to work as part of the story or add to the backlog
 - As a general rule, refactoring should be completed as part of the story, unless one of these guidelines below comes into effect:
      - The mob has researched the complexity and time required for the work and has determined that it should be added due to complexity and time required
      - It touches a lot of code
      - There is not enough test coverage in the current area that needs to be improved
      - If the task is a bug, to avoid the risk of introducing bugs into production
      - If the item discovered was not part of a story
      - It conflicts with other work in progress

**What Should be in the DevEx / OpEx Backlog?**
 - Experiments related to tech debt go into the devex / opex backlog
 - Experiments not related to tech debt should go in the product backlog as spikes and be prioritized by the product owner. 
 - When in doubt, consult with the team and product owner.

?> To Do:\
?> Consider edit -  "We've identified code, design, or system architecture written in the past that could be reworked" as well as "in the past"