# Developer Check Lists
This file contains various check lists that can help you out when developing on this project and doing things such as adding a new endpoint or creating a new stack.

### New Endpoint Creation Check List
Due to our code architecture, adding a new endpoint is an involved process. The following can be used as a checklist to make sure all the necessary files are created and updated when atttempting to create a new endpoint:

- [ ] create a new `*Lambda.js` file in `./web-api/src`
- [ ] create a new `*Interactor.js` file in `./shared/src/business`
- [ ] add the endpoint to `app.js` or `app-public.js` in `./web-api/src`
- [ ] create a `*Proxy.js` file for this new endpoint inside `./shared/src/proxies`
- [ ] update the `./web-client/src/applicationContext.js` file and import the new proxy interactor
- [ ] update the `./web-api/src/applicationContext.js` file and import the new interactor