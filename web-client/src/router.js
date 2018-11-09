import route from 'riot-route';

route.base('/');

const router = {
  initialize: app => {
    route('/', () => {
      app.getSequence('gotoDashboard')();
    });
    route('/case-detail/*', docketNumber => {
      app.getSequence('gotoCaseDetail')({ docketNumber });
    });
    route('/log-in', () => {
      app.getSequence('gotoLogIn')();
    });
    route('/file-a-petition', () => {
      app.getSequence('gotoFilePetition')();
    });
    route('/style-guide', () => {
      app.getSequence('gotoStyleGuide')();
    });
    route.start(true);
  },
};

export { route, router };
