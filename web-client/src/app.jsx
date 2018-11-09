import { Container } from '@cerebral/react';
import App from 'cerebral';
import mainModule from './main';
import React from 'react';
import ReactDOM from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

import AppComponent from './components/App';
import { router, route } from './router';

/**
 * Instantiates the Cerebral app with React
 */
const app = {
  initialize: (environment, debugTools) => {
    library.add(faFilePdf);
    mainModule.providers.environment = environment;
    mainModule.providers.router = {
      route,
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
