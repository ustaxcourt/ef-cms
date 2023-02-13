## Cerebral W/ typescript and Babel
- Cerebral currently requires a transpile step in order for us to run our javascript. It is using the plugin: babel-plugin-cerebral
- What this plugin does is add an extra transpile step which converts how we use cerebral. It changes all get(state.modal.penalties) => get(state`modal.penalties`). 
- We can either always have this build step or just start using the syntax that cerebral would like us to use.

1. Delete dist folder in root directory
1. Temporarliy comment out ./babel.config.js at root so there are no options.
1. run command at root directory ```npx babel web-client/src --out-dir dist --ignore "**/*.jsx","**/*.test.js" --no-babelrc --plugins=babel-plugin-cerebral```
1. Copy files from dist to web-client using command: ```ditto -V dist/ web-client/src/```
1. Run a format on all files so that the only changes are the babel-cerebral changes by running : ```npm run lint:js/ts:fix```
1. A few files need to be manually updated with new cerebral interface: 
    - If.jsx line 11
    - web-client/src/ustc-ui/Tabs/Tabs.jsx line 193: 
      ``` export const Tabs = connect(
            {
              bind: props`bind`,
              simpleSetter: sequences`cerebralBindSimpleSetStateSequence`,
              value: state`${props`bind`}`,
            },
            TabsComponent,
          );
      ```
    - web-client/src/views/ErrorNotification.jsx line 8 + 9
      ```    alertError: state`alertError`,
              alertHelper: state`alertHelper`,
      ```
    - web-client/src/ustc-ui/Accordion/Accordion.jsx line 86
        ```export const Accordion = connect(
          {
            bind: props`bind`,
            simpleSetter: sequences`cerebralBindSimpleSetStateSequence`,
            value: state`${props`bind`}`,
          },
      ```
    - web-client/src/ustc-ui/Text/TextView.jsx line 11
      ```    text = get(state`${bind}`); ```