import { queryStringDecoder } from './queryStringDecoder';

import {
  faArrowAltCircleLeft,
  faCheckCircle as faCheckCircleRegular,
  faClock,
  faCopy,
  faEdit,
  faEyeSlash,
  faFileAlt,
  faFilePdf as faFilePdfRegular,
  faUser,
} from '@fortawesome/free-regular-svg-icons';
import {
  faCaretDown,
  faCaretLeft,
  faCaretUp,
  faCheck,
  faCheckCircle,
  faCloudUploadAlt,
  faDollarSign,
  faEdit as faEditSolid,
  faEnvelope as faEnvelopeSolid,
  faExclamationTriangle,
  faFileAlt as faFileAltSolid,
  faFilePdf,
  faFlag,
  faLaptop,
  faListUl,
  faPaperclip,
  faPlusCircle,
  faQuestionCircle,
  faSearch,
  faShareSquare,
  faSignOutAlt,
  faSlash,
  faSort,
  faSpinner,
  faSync,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { route, router } from './router';

import { AppComponent } from './views/AppComponent';
import { Container } from '@cerebral/react';
import { IdleActivityMonitor } from './views/IdleActivityMonitor';
import { library } from '@fortawesome/fontawesome-svg-core';
import { presenter } from './presenter/presenter';
import App from 'cerebral';
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Instantiates the Cerebral app with React
 */
const app = {
  initialize: async (applicationContext, debugTools) => {
    const user =
      (await applicationContext
        .getUseCases()
        .getItem({ applicationContext, key: 'user' })) || presenter.state.user;
    presenter.state.user = user;
    applicationContext.setCurrentUser(user);

    const token =
      (await applicationContext
        .getUseCases()
        .getItem({ applicationContext, key: 'token' })) ||
      presenter.state.token;
    presenter.state.token = token;
    applicationContext.setCurrentUserToken(token);

    presenter.state.cognitoLoginUrl = applicationContext.getCognitoLoginUrl();

    const { code, token: queryToken } = queryStringDecoder();

    if (process.env.USTC_ENV === 'prod' && (!user && !code && !queryToken)) {
      window.location.replace(presenter.state.cognitoLoginUrl);
      return;
    }

    presenter.state.constants = applicationContext.getConstants();

    library.add(
      faArrowAltCircleLeft,
      faCaretDown,
      faCaretLeft,
      faCaretUp,
      faCheck,
      faCheckCircle,
      faCheckCircleRegular,
      faClock,
      faCloudUploadAlt,
      faCopy,
      faDollarSign,
      faEdit,
      faEditSolid,
      faEnvelopeSolid,
      faExclamationTriangle,
      faEyeSlash,
      faFileAlt,
      faFileAltSolid,
      faFilePdf,
      faFilePdfRegular,
      faFlag,
      faLaptop,
      faListUl,
      faPaperclip,
      faPlusCircle,
      faQuestionCircle,
      faSearch,
      faShareSquare,
      faSignOutAlt,
      faSlash,
      faSort,
      faSpinner,
      faSync,
      faTimesCircle,
      faUser,
    );
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      route,
    };
    const cerebralApp = App(presenter, debugTools);
    router.initialize(cerebralApp);
    ReactDOM.render(
      <Container app={cerebralApp}>
        <IdleActivityMonitor />
        <AppComponent />
      </Container>,
      document.querySelector('#app'),
    );
  },
};

export { app };
