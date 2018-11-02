import route from 'riot-route';

const router = {
  initialize: app => {
    route('/', () => {
      app.getSequence('gotoHome')();
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
