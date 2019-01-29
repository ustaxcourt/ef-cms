import route from 'riot-route';

route.base('/');
const pageTitleSuffix = ' | U.S. Tax Court';

const router = {
  initialize: app => {
    document.title = 'U.S. Tax Court';
    route('/', () => {
      document.title = `Dashboard ${pageTitleSuffix}`;
      app.getSequence('gotoDashboardSequence')();
    });
    route('/case-detail/*', docketNumber => {
      document.title = `Case details ${pageTitleSuffix}`;
      app.getSequence('gotoCaseDetailSequence')({ docketNumber });
    });
    route('/case-detail/*/documents/*', (docketNumber, documentId) => {
      document.title = `Document details ${pageTitleSuffix}`;
      app.getSequence('gotoDocumentDetailSequence')({
        docketNumber,
        documentId,
      });
    });
    route('/case-detail/*/file-a-document', caseId => {
      document.title = `File a document ${pageTitleSuffix}`;
      app.getSequence('gotoFileDocumentSequence')({ caseId });
    });
    route('/log-in', () => {
      document.title = `Log in ${pageTitleSuffix}`;
      app.getSequence('gotoLogInSequence')();
    });
    route('/log-in...', () => {
      // TRY: http://localhost:1234/log-in?token=taxpayer&path=/case-detail/101-18
      const query = route.query();
      const token = query.token;
      const path = query.path || '/';
      app.getSequence('loginWithTokenSequence')({ token, path });
    });
    route('/start-a-case', () => {
      document.title = `Start a case ${pageTitleSuffix}`;
      app.getSequence('gotoStartCaseSequence')();
    });
    route('/style-guide', () => {
      document.title = `Style Guide ${pageTitleSuffix}`;
      app.getSequence('gotoStyleGuideSequence')();
    });
    route(
      '..',
      () => {
        document.title = `Error ${pageTitleSuffix}`;
        app.getSequence('unauthorizedErrorSequence')({
          error: { title: '', message: '' },
        });
      },
      true,
    );
    route.start(true);
  },
};

export { route, router };
