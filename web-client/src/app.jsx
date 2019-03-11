import {
  faCaretDown,
  faCaretLeft,
  faCaretUp,
  faCheckCircle,
  faCloudUploadAlt,
  faDollarSign,
  faExclamationTriangle,
  faFilePdf,
  faFlag,
  faLaptop,
  faListUl,
  faPaperclip,
  faPlusCircle,
  faQuestionCircle,
  faShareSquare,
  faSignOutAlt,
  faSlash,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  faArrowAltCircleLeft,
  faCheckCircle as faCheckCircleRegular,
  faClock,
  faCopy,
  faEdit,
  faEyeSlash,
  faFilePdf as faFilePdfRegular,
} from '@fortawesome/free-regular-svg-icons';
import { Container } from '@cerebral/react';
import { library } from '@fortawesome/fontawesome-svg-core';
import App from 'cerebral';
import React from 'react';
import ReactDOM from 'react-dom';

import { route, router } from './router';
import { AppComponent } from './views/AppComponent';
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

    presenter.state.constants = applicationContext.getConstants();

    library.add(
      faArrowAltCircleLeft,
      faCaretDown,
      faCaretLeft,
      faCaretUp,
      faCheckCircleRegular,
      faCheckCircle,
      faClock,
      faCloudUploadAlt,
      faCopy,
      faDollarSign,
      faEdit,
      faExclamationTriangle,
      faEyeSlash,
      faFilePdf,
      faFilePdfRegular,
      faFlag,
      faLaptop,
      faListUl,
      faPaperclip,
      faPlusCircle,
      faShareSquare,
      faSignOutAlt,
      faSlash,
      faTimesCircle,
      faQuestionCircle,
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
