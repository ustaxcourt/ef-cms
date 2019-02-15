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
  faPaperclip,
  faPlusCircle,
  faShareSquare,
  faSlash,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  faArrowAltCircleLeft,
  faClock,
  faCopy,
  faEdit,
  faFilePdf as faFilePdfRegular,
  faEyeSlash,
} from '@fortawesome/free-regular-svg-icons';
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
    const user =
      JSON.parse(window.localStorage.getItem('user') || 'null') ||
      presenter.state.user;
    presenter.state.user = user;
    applicationContext.setCurrentUser(user);

    const token =
      JSON.parse(window.localStorage.getItem('token') || 'null') ||
      presenter.state.token;
    presenter.state.token = token;
    applicationContext.setCurrentUserToken(token);

    presenter.state.cognitoLoginUrl = applicationContext.getCognitoLoginUrl();

    library.add(
      faArrowAltCircleLeft,
      faCaretDown,
      faCaretLeft,
      faCaretUp,
      faCheckCircle,
      faClock,
      faCloudUploadAlt,
      faCopy,
      faEdit,
      faExclamationTriangle,
      faEyeSlash,
      faFilePdf,
      faFilePdfRegular,
      faFlag,
      faListUl,
      faPaperclip,
      faPlusCircle,
      faShareSquare,
      faSlash,
      faTimesCircle,
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
