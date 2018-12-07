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
    route('/case-detail/*/file-a-document', caseId => {
      document.title = `File a document ${pageTitleSuffix}`;
      app.getSequence('gotoFileDocument')({ caseId });
    });
    route('/log-in', () => {
      document.title = `Log in ${pageTitleSuffix}`;
      app.getSequence('gotoLogIn')();
    });
    route('/log-in...', () => {
      // TRY: http://localhost:1234/log-in?token=taxpayer&path=/case-detail/00101-18
      const query = route.query();
      const token = query.token;
      const path = query.path || '/';
      app.getSequence('loginWithToken')({ token, path });
    });
    route('/file-a-petition', () => {
      document.title = `File a petition ${pageTitleSuffix}`;
      app.getSequence('gotoFilePetition')();
    });
    route('/file-a-document', () => {
      document.title = `File a document ${pageTitleSuffix}`;
      app.getSequence('gotoFileDocument')();
    });
    route('/style-guide', () => {
      document.title = `Style Guide ${pageTitleSuffix}`;
      app.getSequence('gotoStyleGuide')();
    });
    route.start(true);
  },
};

export { route, router };
