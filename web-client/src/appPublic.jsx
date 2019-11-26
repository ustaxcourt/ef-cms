import { AppComponentPublic } from './views/AppComponentPublic';
import { Container } from '@cerebral/react';
import { externalRoute } from './router';
import { isFunction, mapValues } from 'lodash';
import { library } from '@fortawesome/fontawesome-svg-core';
import { presenter } from './presenter/presenter-public';
import { withAppContextDecorator } from './withAppContext';
import App from 'cerebral';
import React from 'react';
import ReactDOM from 'react-dom';

import { faUser } from '@fortawesome/free-regular-svg-icons';

import {
  faSearch,
  faTimesCircle as faTimesCircleRegular,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Instantiates the Cerebral app with React
 */
const appPublic = {
  initialize: async (applicationContext, debugTools) => {
    // decorate all computed functions so they receive applicationContext as second argument ('get' is first)
    presenter.state = mapValues(presenter.state, value => {
      if (isFunction(value)) {
        return withAppContextDecorator(value, applicationContext);
      }
      return value;
    });

    library.add(faSearch, faTimesCircleRegular, faUser);

    presenter.providers.applicationContext = applicationContext;
    presenter.state.cognitoLoginUrl = applicationContext.getCognitoLoginUrl();

    presenter.state.constants = applicationContext.getConstants();

    presenter.providers.router = {
      externalRoute,
    };

    const cerebralApp = App(presenter, debugTools);

    ReactDOM.render(
      <Container app={cerebralApp}>
        <AppComponentPublic />
        {process.env.CI && <div id="ci-environment">CI Test Environment</div>}
      </Container>,
      document.querySelector('#app-public'),
    );
  },
};

export { appPublic };
