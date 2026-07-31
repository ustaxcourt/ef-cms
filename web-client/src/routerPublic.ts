import {
  getRumPageIdFromRoutePattern,
  recordRumPageView,
} from '@web-client/providers/realUserMonitoring';
import { setPageTitle } from './presenter/utilities/setPageTitle';
import route from 'riot-route';

route.base('/');

const externalRoute = path => {
  window.location.href = path;
};

const back = () => {
  window.history.back();
};

const createObjectURL = object => {
  return window.URL.createObjectURL(object);
};

const revokeObjectURL = url => {
  return window.URL.revokeObjectURL(url);
};

const router = {
  initialize: app => {
    window.document.title = 'U.S. Tax Court';
    // expose route function on window for use with cypress

    (window as Window & { __cy_route?: (path: string) => void }).__cy_route =
      path => route(path || '/');

    const trackedRoute = (
      pattern: string,
      handler: (...args: any[]) => any,
    ): void => {
      route(pattern, (...args) => {
        recordRumPageView(getRumPageIdFromRoutePattern(pattern));
        return handler(...args);
      });
    };

    trackedRoute('/case-detail/*', docketNumber => {
      setPageTitle(`Docket ${docketNumber}`);
      app.getSequence('gotoPublicCaseDetailSequence')({ docketNumber });
    });

    trackedRoute('/case-detail/*/printable-docket-record', docketNumber => {
      setPageTitle(`Docket ${docketNumber}`);
      app.getSequence('gotoPublicPrintableDocketRecordSequence')({
        docketNumber,
      });
    });

    trackedRoute('/todays-opinions', () => {
      setPageTitle('Today’s Opinions');
      app.getSequence('gotoTodaysOpinionsSequence')();
    });

    trackedRoute('/todays-orders', () => {
      setPageTitle('Today’s Orders');
      app.getSequence('gotoTodaysOrdersSequence')();
    });

    trackedRoute('/health', () => {
      setPageTitle('Health Check');
      return app.getSequence('gotoHealthCheckSequence')();
    });

    trackedRoute('/', () => {
      setPageTitle('Dashboard');
      app.getSequence('gotoPublicSearchSequence')();
    });

    trackedRoute('/privacy', () => {
      setPageTitle('Privacy');
      return app.getSequence('gotoPrivacySequence')();
    });

    trackedRoute('/contact', () => {
      setPageTitle('Contact');
      return app.getSequence('gotoContactSequence')();
    });

    trackedRoute('/email-verification-instructions', () => {
      setPageTitle('Email Verification Instructions');
      return app.getSequence(
        'gotoPublicEmailVerificationInstructionsSequence',
      )();
    });

    trackedRoute('/maintenance', () => {
      setPageTitle('Maintenance');
      return app.getSequence('gotoMaintenanceSequence')();
    });

    trackedRoute('/login', () => {
      return app.getSequence('redirectToLoginSequence')();
    });

    trackedRoute('/trial-sessions', () => {
      setPageTitle('Trial sessions');
      return app.getSequence('gotoPublicTrialSessionsSequence')();
    });

    trackedRoute('/trial-session-detail/*', trialSessionId => {
      setPageTitle('Trial session information');
      return app.getSequence('gotoPublicTrialSessionDetailsSequence')({
        trialSessionId,
      });
    });

    trackedRoute('/verify-email..', () => {
      setPageTitle('Verify Email');
      const { token } = route.query();

      return app.getSequence('gotoVerifyEmailSequence')({
        token,
      });
    });

    // only visible on lower envs
    trackedRoute('/dawson-library', () => {
      if (process.env.ENV === 'prod') {
        return app.getSequence('notFoundErrorSequence')({
          error: {},
        });
      }
      setPageTitle('Dawson Library');
      return app.getSequence('gotoDawsonLibrarySequence')();
    });

    trackedRoute('..', () => {
      setPageTitle('Error');
      return app.getSequence('notFoundErrorSequence')({
        error: {},
      });
    });

    route.start(true);
  },
};

export { back, externalRoute, route, router, revokeObjectURL, createObjectURL };
