import { AppComponent } from './views/AppComponent';
import { Container } from '@cerebral/react';
import { IdleActivityMonitor } from './views/IdleActivityMonitor';
import { externalRoute, route, router } from './router';
import {
  faArrowAltCircleLeft as faArrowAltCircleLeftRegular,
  faCheckCircle as faCheckCircleRegular,
  faClock,
  faClone,
  faCopy,
  faEdit,
  faEyeSlash,
  faFileAlt,
  faFilePdf as faFilePdfRegular,
  faUser,
} from '@fortawesome/free-regular-svg-icons';
import {
  faArrowAltCircleLeft as faArrowAltCircleLeftSolid,
  faCalendarAlt,
  faCalendarCheck,
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faCheck,
  faCheckCircle,
  faClipboardList,
  faClock as faClockSolid,
  faCloudDownloadAlt,
  faCloudUploadAlt,
  faCopy as faCopySolid,
  faDollarSign,
  faEdit as faEditSolid,
  faEnvelope as faEnvelopeSolid,
  faExclamationCircle,
  faExclamationTriangle,
  faFile,
  faFileAlt as faFileAltSolid,
  faFilePdf,
  faFlag,
  faHome,
  faLaptop,
  faLink,
  faListUl,
  faPaperPlane,
  faPaperclip,
  faPlusCircle,
  faPrint,
  faQuestionCircle,
  faRedoAlt,
  faSearch,
  faShareSquare,
  faShieldAlt,
  faSignOutAlt,
  faSlash,
  faSort,
  faSpinner,
  faStepBackward,
  faStepForward,
  faSync,
  faThumbtack,
  faTimesCircle,
  faTrash,
  faUserCheck,
} from '@fortawesome/free-solid-svg-icons';
import { isFunction, mapValues } from 'lodash';
import { library } from '@fortawesome/fontawesome-svg-core';
import { presenter } from './presenter/presenter';
import { withAppContextDecorator } from './withAppContext';
import App from 'cerebral';
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Instantiates the Cerebral app with React
 */
const app = {
  initialize: async (applicationContext, debugTools) => {
    const scannerSourceName = await applicationContext
      .getUseCases()
      .getItemInteractor({ applicationContext, key: 'scannerSourceName' });
    presenter.state.scanner = {
      scannerSourceName,
    };

    const user =
      (await applicationContext
        .getUseCases()
        .getItemInteractor({ applicationContext, key: 'user' })) ||
      presenter.state.user;
    presenter.state.user = user;
    applicationContext.setCurrentUser(user);

    // decorate all computed functions so they receive applicationContext as second argument ('get' is first)
    presenter.state = mapValues(presenter.state, value => {
      if (isFunction(value)) {
        return withAppContextDecorator(value, applicationContext);
      }
      return value;
    });

    const token =
      (await applicationContext
        .getUseCases()
        .getItemInteractor({ applicationContext, key: 'token' })) ||
      presenter.state.token;
    presenter.state.token = token;
    applicationContext.setCurrentUserToken(token);

    presenter.state.cognitoLoginUrl = applicationContext.getCognitoLoginUrl();

    presenter.state.constants = applicationContext.getConstants();

    library.add(
      faArrowAltCircleLeftRegular,
      faArrowAltCircleLeftSolid,
      faCalendarAlt,
      faCalendarCheck,
      faCaretDown,
      faExclamationCircle,
      faCaretLeft,
      faCaretRight,
      faCaretUp,
      faCheck,
      faCheckCircle,
      faCheckCircleRegular,
      faClipboardList,
      faClock,
      faStepForward,
      faStepBackward,
      faClockSolid,
      faClone,
      faCloudDownloadAlt,
      faCloudUploadAlt,
      faCopy,
      faCopySolid,
      faDollarSign,
      faEdit,
      faEditSolid,
      faEnvelopeSolid,
      faExclamationTriangle,
      faEyeSlash,
      faFile,
      faFileAlt,
      faFileAltSolid,
      faHome,
      faFilePdf,
      faFilePdfRegular,
      faFlag,
      faLaptop,
      faLink,
      faListUl,
      faPaperclip,
      faRedoAlt,
      faPaperPlane,
      faPlusCircle,
      faPrint,
      faQuestionCircle,
      faSearch,
      faShareSquare,
      faShieldAlt,
      faSignOutAlt,
      faSlash,
      faSort,
      faSpinner,
      faSync,
      faThumbtack,
      faTimesCircle,
      faTrash,
      faUser,
      faUserCheck,
    );
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      externalRoute,
      route,
    };
    const cerebralApp = App(presenter, debugTools);

    router.initialize(cerebralApp);

    ReactDOM.render(
      <Container app={cerebralApp}>
        <IdleActivityMonitor />
        <AppComponent />
        {process.env.CI && <div id="ci-environment">CI Test Environment</div>}
      </Container>,
      document.querySelector('#app'),
    );
  },
};

export { app };
