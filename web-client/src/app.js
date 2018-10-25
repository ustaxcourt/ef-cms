import { Container } from '@cerebral/react';
import App from 'cerebral';
import mainModule from './main';
import React from 'react';
import ReactDOM from 'react-dom';
import Devtools from 'cerebral/devtools';

import '@babel/polyfill';

import AppComponent from './components/App';
import router from './router';

/**
 * Instantiates the Cerebral app with React
 */
const app = {
  initialize: environment => {
    mainModule.providers.environment = environment;
    const debugTools = {
      devtools: Devtools({
        host: 'localhost:8585',
      }),
    };
    const cerebralApp = App(mainModule, debugTools);
    router.initialize(cerebralApp);
    ReactDOM.render(
      <Container app={cerebralApp}>
        <AppComponent />
      </Container>,
      document.querySelector('#app'),
    );
  },
};

export default app;
