import { setPageTitle } from './presenter/utilities/setPageTitle';
import route from 'riot-route';

route.base('/');

const externalRoute = path => {
  window.location.replace(path);
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
    // eslint-disable-next-line no-underscore-dangle
    window.__cy_route = path => router.route(path || '/');

    route('/case-detail/*', docketNumber => {
      setPageTitle(`Docket ${docketNumber}`);
      app.getSequence('gotoPublicCaseDetailSequence')({ docketNumber });
    });

    route('/create-account/petitioner', () => {
      setPageTitle('Account Registration');
      app.getSequence('goToCreatePetitionerAccountSequence')();
    });

    route('/create-account/verification-sent', () => {
      setPageTitle('Verification Sent');
      app.getSequence('goToVerificationSentSequence')();
    });

    route('/case-detail/*/printable-docket-record', docketNumber => {
      setPageTitle(`Docket ${docketNumber}`);
      app.getSequence('gotoPublicPrintableDocketRecordSequence')({
        docketNumber,
      });
    });

    route('/todays-opinions', () => {
      setPageTitle('Today’s Opinions');
      app.getSequence('gotoTodaysOpinionsSequence')();
    });

    route('/todays-orders', () => {
      setPageTitle('Today’s Orders');
      app.getSequence('gotoTodaysOrdersSequence')();
    });

    route('/health', () => {
      setPageTitle('Health Check');
      return app.getSequence('gotoHealthCheckSequence')();
    });

    route('/', () => {
      setPageTitle('Dashboard');
      app.getSequence('gotoPublicSearchSequence')();
    });

    route('/privacy', () => {
      setPageTitle('Privacy');
      return app.getSequence('gotoPrivacySequence')();
    });

    route('/contact', () => {
      setPageTitle('Contact');
      return app.getSequence('gotoContactSequence')();
    });

    route('/email-verification-success', () => {
      setPageTitle('Email Verification Success');
      return app.getSequence('gotoPublicEmailVerificationSuccessSequence')();
    });

    route('/email-verification-instructions', () => {
      setPageTitle('Email Verification Instructions');
      return app.getSequence(
        'gotoPublicEmailVerificationInstructionsSequence',
      )();
    });

    route('/maintenance', () => {
      setPageTitle('Maintenance');
      return app.getSequence('gotoMaintenanceSequence')();
    });

    route('/confirm-signup?..', () => {
      const { confirmationCode, email } = route.query();
      return app.getSequence('confirmSignUpSequence')({
        confirmationCode,
        userEmail: email,
      });
    });

    route('/login', () => {
      return app.getSequence('redirectToLoginSequence')();
    });

    route('..', () => {
      setPageTitle('Error');
      return app.getSequence('notFoundErrorSequence')({
        error: {},
      });
    });

    route.start(true);
  },
};

export { back, externalRoute, route, router, revokeObjectURL, createObjectURL };
