import { setPageTitle } from './presenter/utilities/setPageTitle';
import route from 'riot-route';

route.base('/');

const externalRoute = path => {
  window.location.replace(path);
};

const back = () => {
  window.history.back();
};

const router = {
  initialize: app => {
    document.title = 'U.S. Tax Court';

    route('/', () => {
      setPageTitle('Dashboard');
      app.getSequence('gotoPublicSearchSequence')();
    });

    route('/case-detail/*', docketNumber => {
      setPageTitle(`Docket ${docketNumber}`);
      app.getSequence('gotoPublicCaseDetailSequence')({ docketNumber });
    });

    route.start(true);
  },
};

export { back, externalRoute, route, router };
