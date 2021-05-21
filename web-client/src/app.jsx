import './index.scss';

import '../../node_modules/@fortawesome/fontawesome-svg-core/styles.css';

import { AppComponent } from './views/AppComponent';
import { AppInstanceManager } from './AppInstanceManager';
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

import { faAddressCard } from '@fortawesome/free-regular-svg-icons/faAddressCard';
import { faArrowAltCircleLeft as faArrowAltCircleLeftRegular } from '@fortawesome/free-regular-svg-icons/faArrowAltCircleLeft';
import { faCheckCircle as faCheckCircleRegular } from '@fortawesome/free-regular-svg-icons/faCheckCircle';
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock';
import { faClone } from '@fortawesome/free-regular-svg-icons/faClone';
import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy';
import { faEdit } from '@fortawesome/free-regular-svg-icons/faEdit';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons/faEyeSlash';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons/faFileAlt';
import { faFilePdf as faFilePdfRegular } from '@fortawesome/free-regular-svg-icons/faFilePdf';
import { faTimesCircle as faTimesCircleRegular } from '@fortawesome/free-regular-svg-icons/faTimesCircle';
import { faUser } from '@fortawesome/free-regular-svg-icons/faUser';

//if you see a console error saying could not get icon, make sure the prefix matches the import (eg fas should be imported from free-solid-svg-icons)
import { faArrowAltCircleLeft as faArrowAltCircleLeftSolid } from '@fortawesome/free-solid-svg-icons/faArrowAltCircleLeft';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faCalculator } from '@fortawesome/free-solid-svg-icons/faCalculator';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons/faCalendarCheck';
import { faCalendarPlus } from '@fortawesome/free-solid-svg-icons/faCalendarPlus';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons/faCaretLeft';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons/faClipboardList';
import { faClock as faClockSolid } from '@fortawesome/free-solid-svg-icons/faClock';
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons/faCloudDownloadAlt';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons/faCloudUploadAlt';
import { faCopy as faCopySolid } from '@fortawesome/free-solid-svg-icons/faCopy';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons/faDollarSign';
import { faEdit as faEditSolid } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons/faEnvelopeOpen';
import { faEnvelope as faEnvelopeSolid } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/faExclamation';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faEye as faEyeSolid } from '@fortawesome/free-solid-svg-icons/faEye';
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile';
import { faFileAlt as faFileAltSolid } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faFingerprint } from '@fortawesome/free-solid-svg-icons/faFingerprint';
import { faFlag } from '@fortawesome/free-solid-svg-icons/faFlag';
import { faGavel } from '@fortawesome/free-solid-svg-icons/faGavel';
import { faHandPaper } from '@fortawesome/free-solid-svg-icons/faHandPaper';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faLaptop } from '@fortawesome/free-solid-svg-icons/faLaptop';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';
import { faListUl } from '@fortawesome/free-solid-svg-icons/faListUl';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faLongArrowAltUp } from '@fortawesome/free-solid-svg-icons/faLongArrowAltUp';
import { faMailBulk } from '@fortawesome/free-solid-svg-icons/faMailBulk';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons/faMinusCircle';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons/faPaperPlane';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons/faPaperclip';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faPrint } from '@fortawesome/free-solid-svg-icons/faPrint';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons/faRedoAlt';
import { faReply } from '@fortawesome/free-solid-svg-icons/faReply';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faShareSquare } from '@fortawesome/free-solid-svg-icons/faShareSquare';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons/faShieldAlt';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faSlash } from '@fortawesome/free-solid-svg-icons/faSlash';
import { faSort } from '@fortawesome/free-solid-svg-icons/faSort';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faStepBackward } from '@fortawesome/free-solid-svg-icons/faStepBackward';
import { faStepForward } from '@fortawesome/free-solid-svg-icons/faStepForward';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons/faStickyNote';
import { faStrikethrough } from '@fortawesome/free-solid-svg-icons/faStrikethrough';
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons/faThumbtack';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons/faUserCheck';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons/faUserFriends';

import { config, library } from '@fortawesome/fontawesome-svg-core';
import { isFunction, mapValues } from 'lodash';
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
      .getItemInteractor(applicationContext, { key: 'scannerSourceName' });
    const scanMode = await applicationContext
      .getUseCases()
      .getItemInteractor(applicationContext, { key: 'scanMode' });
    presenter.state.scanner.scannerSourceName = scannerSourceName;
    presenter.state.scanner.scanMode = scanMode;

    const user =
      (await applicationContext
        .getUseCases()
        .getItemInteractor(applicationContext, { key: 'user' })) ||
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
        .getItemInteractor(applicationContext, { key: 'token' })) ||
      presenter.state.token;
    presenter.state.token = token;
    applicationContext.setCurrentUserToken(token);

    presenter.state.cognitoLoginUrl = applicationContext.getCognitoLoginUrl();

    presenter.state.constants = applicationContext.getConstants();

    config.autoAddCss = false;
    library.add(
      faArrowAltCircleLeftRegular,
      faArrowAltCircleLeftSolid,
      faAddressCard,
      faCalculator,
      faCalendarAlt,
      faCalendarCheck,
      faCalendarPlus,
      faCaretDown,
      faCaretLeft,
      faCaretRight,
      faCaretUp,
      faCheck,
      faCheckCircle,
      faCheckCircleRegular,
      faCircle,
      faClipboardList,
      faClock,
      faClockSolid,
      faClone,
      faCloudDownloadAlt,
      faCloudUploadAlt,
      faCopy,
      faCopySolid,
      faDollarSign,
      faEdit,
      faEditSolid,
      faEnvelopeOpen,
      faArrowRight,
      faEnvelopeSolid,
      faExclamation,
      faExclamationCircle,
      faExclamationTriangle,
      faEyeSlash,
      faEyeSolid,
      faFile,
      faFileAlt,
      faFileAltSolid,
      faFilePdf,
      faFilePdfRegular,
      faFingerprint,
      faFlag,
      faGavel,
      faHandPaper,
      faHome,
      faInfoCircle,
      faLaptop,
      faLink,
      faListUl,
      faLock,
      faLongArrowAltUp,
      faMailBulk,
      faMinus,
      faMinusCircle,
      faPaperclip,
      faPaperPlane,
      faPencilAlt,
      faPhone,
      faPlus,
      faPlusCircle,
      faPrint,
      faQuestionCircle,
      faRedoAlt,
      faReply,
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
      faStrikethrough,
      faSync,
      faThumbtack,
      faTimesCircle,
      faTimesCircleRegular,
      faTrash,
      faUser,
      faUserCheck,
      faUserFriends,
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

    router.initialize(cerebralApp, route);
    initializeSocketProvider(cerebralApp, applicationContext);

    ReactDOM.render(
      <Container app={cerebralApp}>
        {!process.env.CI && (
          <>
            <IdleActivityMonitor />
            <AppInstanceManager />
          </>
        )}

        <AppComponent />

        {process.env.CI && <div id="ci-environment">CI Test Environment</div>}
      </Container>,
      window.document.querySelector('#app'),
    );
  },
};

export { app };
