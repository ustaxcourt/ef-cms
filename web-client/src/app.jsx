import { AppComponent } from './views/AppComponent';
import { Container } from '@cerebral/react';
import { IdleActivityMonitor } from './views/IdleActivityMonitor';
import {
  back,
  createObjectURL,
  externalRoute,
  openInNewTab,
  revokeObjectURL,
  route,
  router,
} from './router';
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
  faTimesCircle as faTimesCircleRegular,
  faUser,
} from '@fortawesome/free-regular-svg-icons';
import {
  faArrowAltCircleLeft as faArrowAltCircleLeftSolid,
  faCalendarAlt,
  faCalendarCheck,
  faCalendarPlus,
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
  faGavel,
  faHandPaper,
  faHome,
  faInfoCircle,
  faLaptop,
  faLink,
  faListUl,
  faPaperPlane,
  faPaperclip,
  faPencilAlt,
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
  faStar,
  faStepBackward,
  faStepForward,
  faStickyNote,
  faSync,
  faThumbtack,
  faTimesCircle,
  faTrash,
  faUserCheck,
} from '@fortawesome/free-solid-svg-icons';
import { isFunction, mapValues } from 'lodash';
import { library } from '@fortawesome/fontawesome-svg-core';
import { presenter } from './presenter/presenter';
import { socketProvider } from './providers/socket';
import { socketRouter } from './providers/socketRouter';
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
    const scanMode = await applicationContext
      .getUseCases()
      .getItemInteractor({ applicationContext, key: 'scanMode' });
    presenter.state.scanner = {
      scanMode,
      scannerSourceName,
    };

    const user =
      (await applicationContext
        .getUseCases()
        .getItemInteractor({ applicationContext, key: 'user' })) ||
      presenter.state.user;
    presenter.state.user = user;
    applicationContext.setCurrentUser(user);

    const userPermissions = applicationContext.getCurrentUserPermissions();
    if (userPermissions) {
      presenter.state.permissions = userPermissions;
    }

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
      faCalendarPlus,
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
      faHandPaper,
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
      faPencilAlt,
      faFileAlt,
      faFileAltSolid,
      faGavel,
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
      faStar,
      faSpinner,
      faStickyNote,
      faSync,
      faThumbtack,
      faTimesCircle,
      faTimesCircleRegular,
      faTrash,
      faUser,
      faUserCheck,
      faInfoCircle,
    );
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      back,
      createObjectURL,
      externalRoute,
      openInNewTab,
      revokeObjectURL,
      route,
    };
    const {
      initialize: initializeSocketProvider,
      start,
      stop,
    } = socketProvider({
      socketRouter,
    });
    presenter.providers.socket = { start, stop };

    const cerebralApp = App(presenter, debugTools);

    router.initialize(cerebralApp);
    initializeSocketProvider(cerebralApp);

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
