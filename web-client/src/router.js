import route from 'riot-route';
import queryString from 'query-string';

route.base('/');
const pageTitleSuffix = ' | U.S. Tax Court';

const checkUserLoggedIn = app => {
  if (!app.getState('user')) {
    const path = app.getState('cognitoLoginUrl');
    window.location.replace(path);
    return false;
  }
  return true;
};
const router = {
  initialize: app => {
    document.title = 'U.S. Tax Court';
    route('/', () => {
      // TODO: we should implement this on all routes via helper function
      if (checkUserLoggedIn(app)) {
        document.title = `Dashboard ${pageTitleSuffix}`;
        app.getSequence('gotoDashboardSequence')();
      }
    });
    route('/case-detail/*', docketNumber => {
      if (checkUserLoggedIn(app)) {
        document.title = `Case details ${pageTitleSuffix}`;
        app.getSequence('gotoCaseDetailSequence')({ docketNumber });
      }
    });
    route('/case-detail/*/documents/*', (docketNumber, documentId) => {
      if (checkUserLoggedIn(app)) {
        document.title = `Document details ${pageTitleSuffix}`;
        app.getSequence('gotoDocumentDetailSequence')({
          docketNumber,
          documentId,
        });
      }
    });
    route('/case-detail/*/file-a-document', caseId => {
      if (checkUserLoggedIn(app)) {
        document.title = `File a document ${pageTitleSuffix}`;
        app.getSequence('gotoFileDocumentSequence')({ caseId });
      }
    });
    route('/log-in...', () => {
      // TRY: http://localhost:1234/log-in?token=taxpayer&path=/case-detail/101-18
      const query = queryString.parse(location.search);
      const hash = queryString.parse(location.hash); // cognito uses a # instead of ?
      const token = hash.id_token || query.token;
      const path = query.path || '/';
      app.getSequence('loginWithTokenSequence')({ token, path });
    });
    route('/before-starting-a-case', () => {
      if (checkUserLoggedIn(app)) {
        document.title = `Before you start a case ${pageTitleSuffix}`;
        app.getSequence('gotoBeforeStartCaseSequence')();
      }
    });
    route('/start-a-case', () => {
      if (checkUserLoggedIn(app)) {
        document.title = `Start a case ${pageTitleSuffix}`;
        app.getSequence('gotoStartCaseSequence')();
      }
    });
    route('/style-guide', () => {
      if (checkUserLoggedIn(app)) {
        document.title = `Style Guide ${pageTitleSuffix}`;
        app.getSequence('gotoStyleGuideSequence')();
      }
    });
    route('/mock-login...', () => {
      const query = queryString.parse(location.search);
      const { token, path } = query;
      if (token) {
        document.title = `Mock Login ${pageTitleSuffix}`;
        app.getSequence('submitLoginSequence')({ token, path });
        return;
      }

      if (process.env.COGNITO) {
        //USTC_ENV is undefined in prod
        document.title = `Dashboard ${pageTitleSuffix}`;
        app.getSequence('gotoDashboardSequence')();
      } else {
        document.title = `Mock Login ${pageTitleSuffix}`;
        app.getSequence('gotoLoginSequence')();
      }
    });
    route(
      '..',
      () => {
        document.title = `Error ${pageTitleSuffix}`;
        app.getSequence('unauthorizedErrorSequence')({
          error: {},
        });
      },
      true,
    );
    route.start(true);
  },
};

export { route, router };
