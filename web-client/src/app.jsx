import {
  faArrowAltCircleLeft,
  faCheckCircle as faCheckCircleRegular,
  faClock,
  faCopy,
  faEdit,
  faEyeSlash,
  faFilePdf as faFilePdfRegular,
} from '@fortawesome/free-regular-svg-icons';
import {
  faCaretDown,
  faCaretLeft,
  faCaretUp,
  faCheckCircle,
  faCloudUploadAlt,
  faDollarSign,
  faEdit as faEditSolid,
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
  faSync,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { route, router } from './router';

import App from 'cerebral';
import { AppComponent } from './views/AppComponent';
import { Container } from '@cerebral/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
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
      faCheckCircle,
      faCheckCircleRegular,
      faClock,
      faCloudUploadAlt,
      faCopy,
      faDollarSign,
      faEdit,
      faEditSolid,
      faExclamationTriangle,
      faEyeSlash,
      faFilePdf,
      faFilePdfRegular,
      faFlag,
      faLaptop,
      faListUl,
      faPaperclip,
      faPlusCircle,
      faQuestionCircle,
      faShareSquare,
      faSignOutAlt,
      faSlash,
      faSync,
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

export { app };
