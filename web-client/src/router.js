import route from 'riot-route';

route.base('/');
const pageTitleSuffix = ' | U.S. Tax Court';

const router = {
  initialize: app => {
    document.title = 'U.S. Tax Court';
    route('/', () => {
      document.title = `Dashboard ${pageTitleSuffix}`;
      app.getSequence('gotoDashboard')();
    });
    route('/case-detail/*', caseId => {
      document.title = `Case details ${pageTitleSuffix}`;
      app.getSequence('gotoCaseDetail')({ caseId });
    });
    route('/log-in', () => {
      document.title = `Log in ${pageTitleSuffix}`;
      app.getSequence('gotoLogIn')();
    });
    route('/file-a-petition', () => {
      document.title = `File a petition ${pageTitleSuffix}`;
      app.getSequence('gotoFilePetition')();
    });
    route('/style-guide', () => {
      document.title = `Style Guide ${pageTitleSuffix}`;
      app.getSequence('gotoStyleGuide')();
    });
    route.start(true);
  },
};

export { route, router };
