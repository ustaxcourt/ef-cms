
# Dawson's Implementation of Clean Architecture

This part of the tutorial is to speak about the clean architecture approach we took on this project.  Understanding clean architecture if important to understand why the code is structured today.

?> Please read more at [https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) if you need more details.

## What is Clean Architecture?

The Dawson's code base was designed to follow a design principal defined in a book called 
[Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).  Reading the book isn't necessary to understand this design since a lot of the examples in that book are dated, way too verbose, and highly focused on enterprise Java but don't let my opinions stop you from reading it.

The overall idea of the design pattern is to separate your application into various layers and each layer must following one simple rule:

> a layer can only depend **inward** on it's **direct inner** child layer

What does that even mean?  Look at a diagram of some rings to break this logic down:

![Clean Architecture](./images/clean-arch.jpeg)

In this diagram, our application is split up into 4 different layers.  `enterprise business rules`, `application business rules`, `interface adapters`, and `frameworks & drivers`.  Inside these layers live different types of code modules you will need to build your application.

To summerize this dependency graph, just know that the blue layer can only depend on the green layer.  The green layer can only depend on the orange layer.  The orange layer can only depend on the yellow layer.  The yellow layer can depend on nothing.  Follow that rule when writing code and your system will following clean architecture.

Since our project is written in Javascript, it makes more sense to replace the word `depends on` with `import X from 'Y'` or `const X = require('Y')`.  Whever you require or import another module in javascript, you **depend** on that module.

### Dependency Inversion

At this point you may ask how does the interactor invoke code from the persistence layer if it isn't allowed to directly import that code? The answer is using dependency inversion.  Basically, instead of requiring the dependency using `import` or `require`, the module is passed into your code externally.  

One way to achieve dependency inversion is to use the approach of dependency injection which is the approach to pass in the dependencies directly into the signature of the method you are calling.

Here is a sipmle example:

```javascript
// NOT USING DI
// this file depends on the ./database.js file / module
const database = require('./database');
function getAllUsers = () => {
    database.query('SELECT * FROM users');
}

// USING DI
// this file depends on an object that has a method called query, that's it
function getAllUsers = (database) => {
    database.query('SELECT * FROM users');
}
```

What this does it decouple your getAllUsers method from the database module and allows for easier testing when it comes to needing to mock out that database object passed in as an argument.

In our Dawson system, we implement dependency injection by defining something called an [applicationContext](https://github.com/ustaxcourt/ef-cms/blob/staging/web-api/src/applicationContext.js).  The applicationContext contains interface methods to allow our `application business rules` layer to invoke methods from an outer layer such as `frameworks & drivers` without needing to depend on them.

Take this interactor for an example:

```javascript
exports.getItemInteractor = async (applicationContext, { key }) => {
  return await applicationContext.getPersistenceGateway().getItem({
    applicationContext,
    key,
  });
};
```

This code doesn't depend on the persistence layer's `getItem` method, instead, it depends on an getItem interface which the actual implementation of the interface is determined externally to this code.  

### Understand a Concrete Example

All this abstract talk about layers and dependencies can get confusing, so let's actually talk about a concrete example.

Imagine you want to write a CLI program that reads names from the users terminal and inserts those names into a database.  You're application would be spit up into 4 main layers.  

- Your `framework & drivers` layer would have code that reads and write to a SQL database. It would also contain the code that reads and writes to the CLI.
- Your `interface adapters` layer might have code that takes results from your `application business rules` and format them in a way that is more user friendly, such as formatting an object into a pretty CLI table.
- Your `application business rules` layer might have logic for accepting a list of names, creating an entity defined in your `enterprise business rules`, validate the entity, and invoke a `framework & driver` module to store them into the database.
- Your `enterprise business rules` layer might contain an entity called Person which takes in a name and will validate the name is proper case, has no special characters, and doesn't contain the name Rick Astley.  These validation rules basically define the rules of your business data.

So, using that info, we could maybe build something like this:

![Clean Architecture Example](./images/ca-example.png)

Basically, the presenter depends and invokes the interactor, the interactor depends on and invokes the entity, but the interactor **can't** directly depend on code from the persistence layer; therefore, the only way the interactor can invoke a persistence method is via dependency inversion.

## Application Context

The Dawson project has different implmentations of applicationContext, so be sure to watch which directory you are modifying when needing to add new methods.

- The Private UI uses the application context located at web-client/src/applicationContext
- The Public UI uses the application context located at web-client/src/applicationContextPublic
- The API uses the application context at web-api/src/applicationContext

> A lot of the helper scripts used for the infrastructure and migrations also use the web-api's applicationContext

There are a lot of methods on the applicationContext, but the most common ones you'll probably run into include:

- `applicationContext.getPersistenceGateway` - anything that hits our databases, elasticsearch, sqs, or third party services
- `applicationContext.getUseCases` - all of the business interactors
- `applicationContext.getUseCaseHelpers` - shared pieces of logic that many interactors might need to use
- `applicationContext.getUtilities` - various helpers functions used for dates, timestamps, etc

To make things less confusing, we try to keep some of the methods on the different applicationContext files in sync.  For example, if there is a method on the web-api applicationContext called getLogger, then it should be available on the web-client applicationContext.

## Pros and Cons of Clean Architecture

### Pros

Clean architecture decouples your code.  For example, instead of your business logic depending directly on methods that interact with MySQL, your code only cares about interacting with an interface.  This allows you to swap out implementation details without needing to refactoring a lot of code.  It also allows us to easily write unit tests over code since most of everything depends on an interface.  Since everything is setup on the applicationContext, it's very easy to provide a mock applicationContext that returns different implementations to test how you need.

### Cons

Although clean architecture helps decouple your modules, it does make it more difficult to follow the path in your code base.  For example, typically you can right click on a function in your editor and click "go to implementation", but since now everything is coded to an interface, the editors don't know where the implementation lives.  Our approach also requires additional setup steps to add methods to our applicationContext instead of just adding a require statement to the top of the file.