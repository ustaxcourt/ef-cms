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
import { config, library } from '@fortawesome/fontawesome-svg-core';
import { createRoot } from 'react-dom/client';
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
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons/faClipboardList';
import { faClock as faClockSolid } from '@fortawesome/free-solid-svg-icons/faClock';
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons/faCloudDownloadAlt';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons/faCloudUploadAlt';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons/faCommentDots';
import { faCopy as faCopySolid } from '@fortawesome/free-solid-svg-icons/faCopy';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons/faDollarSign';
import { faEdit as faEditSolid } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons/faEnvelopeOpen';
import { faEnvelope as faEnvelopeSolid } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons/faExchangeAlt';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/faExclamation';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faEye as faEyeSolid } from '@fortawesome/free-solid-svg-icons/faEye';
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile';
import { faFileAlt as faFileAltSolid } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faFileExport } from '@fortawesome/free-solid-svg-icons/faFileExport';
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
import { faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons/faLongArrowAltDown';
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
import { faStamp } from '@fortawesome/free-solid-svg-icons/faStamp';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faStepBackward } from '@fortawesome/free-solid-svg-icons/faStepBackward';
import { faStepForward } from '@fortawesome/free-solid-svg-icons/faStepForward';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons/faStickyNote';
import { faStrikethrough } from '@fortawesome/free-solid-svg-icons/faStrikethrough';
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons/faThumbtack';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faUnlock } from '@fortawesome/free-solid-svg-icons/faUnlock';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons/faUserCheck';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons/faUserFriends';
import { faWrench } from '@fortawesome/free-solid-svg-icons/faWrench';
import { isFunction, mapValues } from 'lodash';
import { presenter } from './presenter/presenter';
import { socketProvider } from './providers/socket';
import { socketRouter } from './providers/socketRouter';
import { withAppContextDecorator } from './withAppContext';
import App from 'cerebral';
import React from 'react';

/**
 * Instantiates the Cerebral app with React
 */
const app = {
  initialize: async applicationContext => {
    const scannerSourceName = await applicationContext
      .getUseCases()
      .getItemInteractor(applicationContext, { key: 'scannerSourceName' });
    const scanMode = await applicationContext
      .getUseCases()
      .getItemInteractor(applicationContext, { key: 'scanMode' });
    presenter.state.scanner.scannerSourceName = scannerSourceName;
    presenter.state.scanner.scanMode = scanMode;

    // decorate all computed functions so they receive applicationContext as second argument ('get' is first)
    presenter.state = mapValues(presenter.state, value => {
      if (isFunction(value)) {
        return withAppContextDecorator(value, applicationContext);
      }
      return value;
    });
    presenter.state.constants = applicationContext.getConstants();
    // TODO 10007: move to state.ts?
    presenter.state.cognitoPasswordChange =
      applicationContext.getCognitoPasswordChangeUrl();
    presenter.state.cognitoRequestPasswordResetUrl =
      applicationContext.getCognitoResetPasswordUrl();

    presenter.state.clientConnectionId = applicationContext.getUniqueId();

    config.autoAddCss = false;
    library.add(
      faArrowAltCircleLeftRegular,
      faArrowAltCircleLeftSolid,
      faAddressCard,
      faExchangeAlt,
      faCalculator,
      faCalendarAlt,
      faTimes,
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
      faCommentDots,
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
      faFileExport,
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
      faLongArrowAltDown,
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
      faStamp,
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
      faUnlock,
      faUser,
      faUserCheck,
      faUserFriends,
      faWrench,
      faChevronUp,
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

    const cerebralApp = App(presenter, {
      returnSequencePromise: true,
    });

    await cerebralApp.getSequence('initAppSequence')();

    initializeSocketProvider(cerebralApp, applicationContext);

    /*
    This is a decorated added to fix race conditions in our UI related to changing routes.
    We use riot-router and it works by using an event listener to the window object when
    the push state occurs, which can cause two of our routes to run in parallel.
    This causes our UI to get into bad states where the url in the browser says /case-detail, but
    we are actually viewing the trial-session page.  These race conditions also cause our integration tests
    and smoke tests to become very flaky.
    */
    let processQueue = Promise.resolve();
    const wrappedRoute = (path, cb) => {
      route(path, function () {
        return (processQueue = processQueue.then(() => {
          // eslint-disable-next-line promise/no-callback-in-promise
          return cb(...arguments);
        }));
      });
    };
    router.initialize(cerebralApp, wrappedRoute);

    const container = window.document.querySelector('#app');
    const root = createRoot(container);

    root.render(
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
    );
  },
};

export { app };
