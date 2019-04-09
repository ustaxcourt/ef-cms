import queryString from 'query-string';
import route from 'riot-route';

route.base('/');
const pageTitleSuffix = ' | U.S. Tax Court';

const router = {
  initialize: app => {
    document.title = 'U.S. Tax Court';
    const checkLoggedIn = cb => {
      return function() {
        if (!app.getState('user')) {
          const path = app.getState('cognitoLoginUrl');
          window.location.replace(path);
        } else {
          cb.apply(null, arguments);
        }
      };
    };
    route(
      '/',
      checkLoggedIn(() => {
        document.title = `Dashboard ${pageTitleSuffix}`;
        app.getSequence('gotoDashboardSequence')();
      }),
    );
    route(
      '/case-detail/*',
      checkLoggedIn(docketNumber => {
        document.title = `Case details ${pageTitleSuffix}`;
        app.getSequence('gotoCaseDetailSequence')({ docketNumber });
      }),
    );
    route(
      '/case-detail/*/documents/*',
      checkLoggedIn((docketNumber, documentId) => {
        document.title = `Document details ${pageTitleSuffix}`;
        app.getSequence('gotoDocumentDetailSequence')({
          docketNumber,
          documentId,
        });
      }),
    );
    route(
      '/case-detail/*/file-a-document',
      checkLoggedIn(docketNumber => {
        document.title = `File a document ${pageTitleSuffix}`;
        app.getSequence('gotoFileDocumentSequence')({ docketNumber });
      }),
    );
    route('/log-in...', () => {
      // TRY: http://localhost:1234/log-in?token=taxpayer&path=/case-detail/101-18
      const query = queryString.parse(location.search);
      const hash = queryString.parse(location.hash); // cognito uses a # instead of ?
      const token = hash.id_token || query.token;
      const path = query.path || '/';
      app.getSequence('loginWithTokenSequence')({ path, token });
    });
    route(
      '/before-starting-a-case',
      checkLoggedIn(() => {
        document.title = `Before you start a case ${pageTitleSuffix}`;
        app.getSequence('gotoBeforeStartCaseSequence')();
      }),
    );
    route(
      '/start-a-case',
      checkLoggedIn(() => {
        document.title = `Start a case ${pageTitleSuffix}`;
        app.getSequence('gotoStartCaseSequence')();
      }),
    );
    route(
      '/style-guide',
      checkLoggedIn(() => {
        document.title = `Style Guide ${pageTitleSuffix}`;
        app.getSequence('gotoStyleGuideSequence')();
      }),
    );
    route('/mock-login...', () => {
      const query = queryString.parse(location.search);
      const { token, path } = query;
      if (token) {
        document.title = `Mock Login ${pageTitleSuffix}`;
        app.getSequence('submitLoginSequence')({ path, token });
        return;
      }

      if (process.env.COGNITO) {
        // USTC_ENV is undefined in prod
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
