import { AppComponentPublic } from './views/AppComponentPublic';
import { Container } from '@cerebral/react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { isFunction, mapValues } from 'lodash';
import { library } from '@fortawesome/fontawesome-svg-core';
import { presenter } from './presenter/presenter-public';
import { withAppContextDecorator } from './withAppContext';
import App from 'cerebral';
import React from 'react';
import ReactDOM from 'react-dom';

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

    library.add(faSearch);
    presenter.providers.applicationContext = applicationContext;

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
