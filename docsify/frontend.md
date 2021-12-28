# Frontend

The frontend user interfaces are major parts of our Dawson system.  They are implemented using React, we use USWDS for the styling, Cerebral for our state management, and terraform to get it all deployed to AWS.  Since every React application is built and structure differently, this part of the docs is written to help give an overview of our frontend structure and insight into some design decisions.

## Project Structure

We tend to keep all our source files related to the bundled application in a `src` directory.  Unit tests live directly next to the components they are testing. Integration and pa11y tests live outside of the src directory.  A majority of the code you write for the UI will live in the `web-client/src/presenter` directory which contains all of our cerebral sequences and actions. 

The overall structure of the web-client directory is as follows with a short description of each directory:

```
.
├── integration-tests // all integration tests against the private UI
│   ├── journey // helper functions
├── integration-tests-public // all integration tests against the public UI
│   ├── journey // helper functions
├── pa11y // all the pa11y scripts for testing the UI
├── src
│   ├── app.jsx // the main entry point for the private UI
│   ├── appPublic.jsx // the main entry point for the public UI
│   ├── applicationContext.js // the application context for the private UI
│   ├── applicationContextPublic.js // the application context for the public UI
│   ├── pdfs // any static downloadable PDFs 
│   ├── presenter
│   │   ├── actions // cerebral actions
│   │   ├── computeds // computed state values
│   │   ├── presenter-public.js // the presenter for the public UI
│   │   ├── presenter.js // the presenter for the private UI
│   │   ├── sequences // all the cerebral sequences
│   │   ├── state-public.js // application state for public app
│   │   ├── state.js // application state
│   │   └── utilities // any helper functions for the UI
│   ├── providers // cerebral providers
│   │   ├── socket.js // used for connected to the websocket endpoints
│   │   ├── socketRouter.js // used to processing and invoking sequences based on websocket event
│   ├── router.js // the router for the private UI
│   ├── routerPublic.js // the router for the public UI
│   ├── styles // all styles in the UI
│   ├── tryCatchDecorator.js // logic for catching certain error codes from interactors changing routes
│   ├── ustc-ui // useable react components 
│   ├── utilities // various untilies used in the UI
│   ├── views // all the non reusable react components in the UI
└── terraform // terraform files for deploying the UIs
    ├── bin // script for running terraform
    ├── common // shared UI module
    ├── dynamsoft // module for deploying dynamosoft EC2 instance
    ├── main // the entrypoint for terraform
    └── ui // module for creating the UI related resources
```

These are the main directories and files.  Note that there are probably some missing, but this is probably a good place to get started with understanding how things are setup.

### Proxies

Whenever the UI needs to call an interactor which lives on the backend, we invoke something called a proxy. These proxy files live in the shared directory.  What is the shared directory for?  It's a place that we can place all our code which may be used by other parts of the application.  The idea is that we can easily write a different application, such as a CLI, and reuse code in the shared directory as needed to achieve the same functionality.

For example, we have a file called `shared/src/proxies/users/getUserProxy.js`.  Proxies just doing http requests to the backend api which is where there real implementation of the interactor lives.

## UI Npm Scripts

There are a lot of scripts related to running, bundling, and testing the frontend.  Although you may not necessarly need to run some of these since our CI/CD pipeline does it for us, here are the most important ones to know about:

- `npm run start:client` - starts the client application
- `npm run start:public` - starts the public client application
- `npm run start:client:no-scanner` - starts the client application with the mock scanner the scanner
- `npm run test:client` - runs the client application unit tests
- `npm run test:client:public` - runs the public client application unit tests
- `npm run test:pa11y` - runs the pa11y tests for the private 
- `npm run test:pa11y:public` - runs the pa11y tests for the public UI
- `npm run build:client` - builds the client application
- `npm run build:client:public` - builds the public client application
- `npm run lint:css` - lints the CSS
- `npm run lint:ui` - lints the UI

Some of this scripts, such as pa11y, require the API to also be running since it requires live data to be displayed in the UI to verify accessibility.

## USWDS

Our project uses the [U.S. Web Design System (USWDS)](https://designsystem.digital.gov/). This library is similar to bootstrap, but it is a standard library that helps government sites all stay uniform in style.  It has various utilities css classes that help with the styling of the site, such as a grid system, components, typography, and color.

At this point, a majority of these USWDS components have been wrapped in our own react components located at [./web-client/src/ustc-ui](https://github.com/ustaxcourt/ef-cms/tree/staging/web-client/src/ustc-ui).

## React

Both of our UIs are written using React.  We use functional react components with [react hooks](https://reactjs.org/docs/hooks-intro.html) instead of class components.  The main guideline we follow when making React components is to keep all logic out of the react component; therefore, if you see anything other than a simple conditional render in our react components, it's probably going against our main principles.  We try to keep all UI logic inside our presenter layer (Cerebral) which allows us to easily test our logic using unit tests and integration tests.

## SCSS Setup

Although we use USWDS for a lot of our UI styling, we do need custom styles.  We use [SCSS](https://sass-lang.com/) in our project for any custom styling.  SCSS is beneficial over normal css because it allows us to nest scoping, variables, modules, mix-ins, partials, etc.  The nesting is one of the most useful features to help keep styling clean and understandable:

```html
<div class="nav-bar">
    <div class="nav-bar-item"></div>
</div>
```

```scss
.nav-bar {
    .nav-bar-item {
        color: red;
    }
}
```


## Cerebral

There are a lot of state management libraries out there for React, but we decided to use one called [CerebralJs](https://cerebraljs.com/docs/introduction/) which follows a declarative for our UI logic.  The overview of cerebral is that our React components bind to Cerebral's state to determine what and when it should show certain components, and React invokes cerebral **sequences** when a user interacts with the UI or changes routes.

The main benefit to **cerebral** is it allows us to be decoupled from React.  If our UIs are architected correctly, we should be able to switch from React to Vue or Angular with very little effort.  Keep as much logic and state as possible out of our React components; let Cerebral manage it.

### Sequences
Cerebral sequences are the main mechanisms for running logic in our UI.  A sequence is just an array of **actions**.  Sequences have support of parallel executions and branching logic.

Sequences are invoked whenever someone interacts with the UI.  For example, when a user navigates to a certain page, such as `/case-detail/101-21`, our riot router will get notified of the route change and invoke a `gotoCaseDetailSequence`.  A good way to think of a sequence is it is basically a more complex promise chain.

Here is an example of a signOutSequence in our application:

```javascript
export const signOutSequence = [
  setCurrentPageAction('Interstitial'),
  stopWebSocketConnectionAction,
  broadcastLogoutAction,
  deleteAuthCookieAction,
  clearAlertsAction,
  clearUserAction,
  clearMaintenanceModeAction,
  clearLoginFormAction,
  navigateToCognitoAction,
];
```

This sequence basically shows a spinner, stops any web socket connections, deletes auth cookies, clears some state, and navigates the user to cognito.  The beautify of this declarative approach is that it is very easy to get a high level overview of what is going on when a sequence executes.  You really don't need to know the internals of how these actions work to understand the sequence.

### Actions

Actions are the building blocks of the sequences.  Each action is a function which can run async code if needed to talk to API endpoints, and they will update the cerebral store.  Here is a small example action we use in our application for setting the case detail on the store.  This action is typically invoked in a sequence directly after a previous action that might be used to fetch the case detail from the API and pass it along in props. A cerebral action is basically the .then() of a promise change

```javascript
import { state } from 'cerebral';

// props - contains data original passed to the sequence, or any object that was returned in previous actions merged together
// store - a cerebral object that can be used for toggling and setting state in the cerebral store
// get - a function you can use to invoke get(state.caseDetail) to get the caseDetail from the state
// applicationContext - our applicationContext as outlined in the Clean Architecture part of these docs
export const setCaseAction = ({ props, store, get, applicationContext }) => {
    store.set(state.caseDetail, props.caseDetail);
};
```

The `props` passed in to the action is actually a merged object of all the return values of previous actions.  For example, in the `signOutSequence` listed above, each action has the ability to return an object, and that object will be merged into the results of any other actions in the sequence.  The action also has access to the `store` argument which is what you use if you want save things onto the cerebral store.  If you want to get things from state, you can use the `get` argument

### State

Our project tries to keep all state in our application store.  The main reason we do this is to achieve as much decoupling from React as possible.  The more state and logic you allow to live in your React components, the harder it is to switch from React in the future.  This approach also allows us to be able to inspect the state at anytime to verify certain things are correct when dealing with writing tests.  If we didn't do this, we'd have to bring in more react specific testing libraries, such as react-testing-library or enzyme which are not as straight forward when it comes to writing tests.  Testing react components directly is also slower since they often require a DOM (JSDOM) implementation to verify they are doing what they are supposed to.

### Computeds

Sometimes we want to compute state using a combination of other state variables. We often will use a computeds to setup various booleans that a UI might need to know when it should hide or show things.  For example, take a look at this menuHelper.js file:

```javascript
import { state } from 'cerebral';

export const menuHelper = get => {
  const isAccountMenuOpen = get(state.navigation.openMenu) === 'AccountMenu';
  const isReportsMenuOpen = get(state.navigation.openMenu) === 'ReportsMenu';
  const isCaseDetailMenuOpen =
    get(state.navigation.caseDetailMenu) === 'CaseDetailMenu';

  return {
    isAccountMenuOpen,
    isCaseDetailMenuOpen,
    isReportsMenuOpen,
  };
};
```

This computed is accessible by doing `get(state.menuHelper)` in our actions and react components.  Using this approach keeps our react components clean of logic.  Instead of having `===` nested all throughout our React components, we instead have that logic computed inside these types of files which also allows us to easily test this logic via a unit test.

!> Don't use a Cerebral computed value in another computed or set state within a computed. More context is detailed here: https://cerebraljs.com/docs/advanced/index.html

### React Components

Our React components still need to connect to cerebral in some type of way.  The current way we connect react components to cerebral is by using the `connection` function provided by cerebral.  Take this pruned down example of our Header.jsx component:

```
export const Header = connect(
  {
    isAccountMenuOpen: state.menuHelper.isAccountMenuOpen,
    isReportsMenuOpen: state.menuHelper.isReportsMenuOpen,
    signOutSequence: sequences.signOutSequence,
    name: props.name,
  },
  function Header({
    isAccountMenuOpen,
    isReportsMenuOpen,
    signOutSequence,
    name,
  }) {
    return <>
        {isAccountMenuOpen && <AccountMenu />}
    </>
  })
);
```

Notice this header is wrapped in the connect function which allows us to get access to the state.menuHelper computed.  We can also gain access to the sequences or any other providers we setup manually in cerebral.  We also have access to the typically react props.  Like mentioned before, we try to keep our react components logicless which means we use booleans from the computeds to determine when something should display.

!> if you are using `===` inside a React component, you should refactor to instead put it in a computed

