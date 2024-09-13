Problem statement: How can we detect when making a validation changes to entities, we do not create invalid data in the database?

- Pull all validation rules into a single file, if they change in any way, a validation sweep must be run on the database
- Continue validating before we return inside all of our interactors but instead of exploding just silently log which entities are now invalid.
- On each deployment validate all data in the database.


Assumptions
- Not all business rules can or should live inside of the persistence layer.
  - For example when a trialSession is calendared it should have a sessionType
- What is and what is not a valid entity can only be expressed inside of functions. 
  - Is it possible to tell if a function has been modified between different git commits?
  - If it is a pure function that does not modify any external state


shared/src/business/entities/contacts/Contact.ts getValidationRules depends on instance.countryType


Thoughts
- If validation rules are expressed inside of functions it is impossible to tell if a function has changed its behavior from one release to another. If it is impossible to tell if validation rules have changed then maybe defensively checking if they have changed, and running a validation sweep on the DB is not the correct approach
- Another option is better warnings to devs about making validation changes. 
- Another option is continue validating, but only log invalid values instead of throwing errors to reduce application impact.


Resources
- Validate at input time. Validate again before you put it in the database. And have database constraints to prevent bad input. And you can bet in spite of all that, bad data will still get into your database, so validate it again when you use it.