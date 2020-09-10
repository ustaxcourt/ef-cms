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
    document.title = 'U.S. Tax Court';
    // expose route function on window for use with cypress
    // eslint-disable-next-line no-underscore-dangle
    window.__cy_route = path => router.route(path || '/');

    route('/case-detail/*', docketNumber => {
      setPageTitle(`Docket ${docketNumber}`);
      app.getSequence('gotoPublicCaseDetailSequence')({ docketNumber });
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

    route('/health', () => {
      setPageTitle('Health Check');
      return app.getSequence('gotoHealthCheckSequence')();
    });

    route('/', () => {
      setPageTitle('Dashboard');
      app.getSequence('gotoPublicSearchSequence')();
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
