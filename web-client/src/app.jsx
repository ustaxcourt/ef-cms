import {
  faCaretDown,
  faCaretLeft,
  faCaretUp,
  faCheckCircle,
  faCloudUploadAlt,
  faExclamationTriangle,
  faFilePdf,
  faFlag,
  faListUl,
  faShareSquare,
} from '@fortawesome/free-solid-svg-icons';
import { Container } from '@cerebral/react';
import { library } from '@fortawesome/fontawesome-svg-core';
import App from 'cerebral';
import React from 'react';
import ReactDOM from 'react-dom';

import { router, route } from './router';
import AppComponent from './views/App';
import presenter from './presenter';

/**
 * Instantiates the Cerebral app with React
 */
const app = {
  initialize: (applicationContext, debugTools) => {
    library.add(
      faCaretDown,
      faCaretLeft,
      faCaretUp,
      faCheckCircle,
      faCloudUploadAlt,
      faExclamationTriangle,
      faFilePdf,
      faFlag,
      faListUl,
      faShareSquare,
    );
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      route,
    };
    const cerebralApp = App(presenter, debugTools);
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
