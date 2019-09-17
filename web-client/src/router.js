import { forEach, set } from 'lodash';
import { queryStringDecoder } from './queryStringDecoder';
import route from 'riot-route';

route.base('/');

const pageTitleSuffix = ' | U.S. Tax Court';

const externalRoute = path => {
  window.location.replace(path);
};

const openInNewTab = path => {
  window.open(path, '_blank', 'noopener, noreferrer');
};

const createObjectURL = object => {
  return window.URL.createObjectURL(object);
};

const revokeObjectURL = url => {
  return window.URL.revokeObjectURL(url);
};

const back = () => {
  window.history.back();
};

const router = {
  initialize: app => {
    document.title = 'U.S. Tax Court';
    const checkLoggedIn = cb => {
      return function() {
        if (!app.getState('user')) {
          const path = app.getState('cognitoLoginUrl');
          window.location.replace(path);
        } else {
          app.getSequence('clearAlertSequence')();
          cb.apply(null, arguments);
        }
      };
    };

    route(
      '/',
      checkLoggedIn(() => {
        document.title = `Dashboard ${pageTitleSuffix}`;
        app.getSequence('gotoDashboardSequence')({ baseRoute: 'dashboard' });
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
      '/case-detail/*/documents/*/edit',
      checkLoggedIn((docketNumber, documentId) => {
        document.title = `Edit Docket Record ${pageTitleSuffix}`;
        app.getSequence('gotoEditDocketEntrySequence')({
          docketNumber,
          documentId,
        });
      }),
    );

    route(
      '/case-detail/*/documents/*/sign',
      checkLoggedIn((docketNumber, documentId) => {
        app.getSequence('gotoSignPDFDocumentSequence')({
          docketNumber,
          documentId,
          pageNumber: 1,
        });
      }),
    );

    route(
      '/case-detail/*/documents/*/messages/*/sign',
      checkLoggedIn((docketNumber, documentId, messageId) => {
        app.getSequence('gotoSignPDFDocumentSequence')({
          docketNumber,
          documentId,
          messageId,
          pageNumber: 1,
        });
      }),
    );

    route(
      '/case-detail/*/documents/*/mark/*',
      checkLoggedIn((docketNumber, documentId, workItemIdToMarkAsRead) => {
        document.title = `Document details ${pageTitleSuffix}`;
        app.getSequence('gotoDocumentDetailSequence')({
          docketNumber,
          documentId,
          workItemIdToMarkAsRead,
        });
      }),
    );

    route(
      '/case-detail/*/documents/*/messages/*',
      checkLoggedIn((docketNumber, documentId, messageId) => {
        document.title = `Document details ${pageTitleSuffix}`;
        app.getSequence('gotoDocumentDetailSequence')({
          docketNumber,
          documentId,
          messageId,
        });
      }),
    );

    route(
      '/case-detail/*/documents/*/messages/*/mark/*',
      checkLoggedIn(
        (docketNumber, documentId, messageId, workItemIdToMarkAsRead) => {
          document.title = `Document details ${pageTitleSuffix}`;
          app.getSequence('gotoDocumentDetailSequence')({
            docketNumber,
            documentId,
            messageId,
            workItemIdToMarkAsRead,
          });
        },
      ),
    );

    route(
      '/case-detail/*/before-you-file-a-document',
      checkLoggedIn(docketNumber => {
        document.title = `Before you file a document ${pageTitleSuffix}`;
        app.getSequence('gotoBeforeYouFileDocumentSequence')({ docketNumber });
      }),
    );

    route(
      '/case-detail/*/file-a-document',
      checkLoggedIn(docketNumber => {
        document.title = `File a document ${pageTitleSuffix}`;
        if (app.getState('currentPage') === 'FileDocumentWizard') {
          app.getSequence('chooseWizardStepSequence')({
            value: 'SelectDocumentType',
          });
        } else {
          app.getSequence('gotoFileDocumentSequence')({ docketNumber });
        }
      }),
    );

    route(
      '/case-detail/*/file-a-document/details',
      checkLoggedIn(docketNumber => {
        document.title = `File a document ${pageTitleSuffix}`;
        if (app.getState('currentPage') === 'FileDocumentWizard') {
          app.getSequence('chooseWizardStepSequence')({
            value: 'FileDocument',
          });
        } else {
          app.getSequence('navigateToPathSequence')({
            path: `/case-detail/${docketNumber}/file-a-document`,
          });
        }
      }),
    );

    route(
      '/case-detail/*/file-a-document/review',
      checkLoggedIn(docketNumber => {
        document.title = `File a document ${pageTitleSuffix}`;
        if (app.getState('currentPage') === 'FileDocumentWizard') {
          app.getSequence('chooseWizardStepSequence')({
            value: 'FileDocumentReview',
          });
        } else {
          app.getSequence('navigateToPathSequence')({
            path: `/case-detail/${docketNumber}/file-a-document`,
          });
        }
      }),
    );

    route(
      '/case-detail/*/file-a-document/all-document-categories',
      checkLoggedIn(docketNumber => {
        document.title = `File a document ${pageTitleSuffix}`;
        if (app.getState('currentPage') === 'FileDocumentWizard') {
          app.getSequence('chooseWizardStepSequence')({
            value: 'ViewAllDocuments',
          });
        } else {
          app.getSequence('navigateToPathSequence')({
            path: `/case-detail/${docketNumber}/file-a-document`,
          });
        }
      }),
    );

    route(
      '/case-detail/*/contacts/primary/edit',
      checkLoggedIn(docketNumber => {
        document.title = `Primary contact ${pageTitleSuffix}`;
        app.getSequence('gotoPrimaryContactEditSequence')({ docketNumber });
      }),
    );
    route(
      '/case-detail/*/create-order',
      checkLoggedIn(docketNumber => {
        document.title = `Create an order ${pageTitleSuffix}`;
        app.getSequence('gotoCreateOrderSequence')({ docketNumber });
      }),
    );

    route(
      '/case-detail/*/edit-order/*',
      checkLoggedIn((docketNumber, documentIdToEdit) => {
        document.title = `Edit an order ${pageTitleSuffix}`;
        const sequence = app.getSequence('gotoEditOrderSequence');
        sequence({
          docketNumber,
          documentIdToEdit,
        });
      }),
    );

    route(
      '/case-detail/*/add-docket-entry',
      checkLoggedIn(docketNumber => {
        document.title = `Add docket entry ${pageTitleSuffix}`;
        app.getSequence('gotoAddDocketEntrySequence')({ docketNumber });
      }),
    );

    route(
      '/case-detail/*/printable-docket-record',
      checkLoggedIn(docketNumber => {
        document.title = `Docket Record ${pageTitleSuffix}`;
        app.getSequence('gotoPrintableDocketRecordSequence')({ docketNumber });
      }),
    );

    route(
      '/case-detail/*/request-access',
      checkLoggedIn(docketNumber => {
        document.title = `Request access ${pageTitleSuffix}`;
        app.getSequence('gotoRequestAccessSequence')({ docketNumber });
      }),
    );

    route(
      '/document-qc..',
      checkLoggedIn(() => {
        const path = route._.getPathFromBase();
        const validPaths = [
          'document-qc',
          'document-qc/my',
          'document-qc/my/inbox',
          'document-qc/my/inProgress',
          'document-qc/my/outbox',
          'document-qc/my/batched',
          'document-qc/section',
          'document-qc/section/inbox',
          'document-qc/section/inProgress',
          'document-qc/section/outbox',
          'document-qc/section/batched',
        ];

        if (path && !validPaths.includes(path)) {
          app.getSequence('notFoundErrorSequence')({
            error: {},
          });
        } else {
          const routeArgs = {
            baseRoute: 'document-qc',
            workQueueIsInternal: false,
          };
          const pathParts = path.split('/');

          if (pathParts[1]) {
            routeArgs.queue = pathParts[1];
          }
          if (pathParts[2]) {
            routeArgs.box = pathParts[2];
          }

          app.getSequence('gotoDashboardSequence')(routeArgs);
        }
        document.title = `Dashboard ${pageTitleSuffix}`;
      }),
    );

    route(
      '/trial-session-detail/*',
      checkLoggedIn(trialSessionId => {
        document.title = `Trial Session Information ${pageTitleSuffix}`;
        app.getSequence('gotoTrialSessionDetailSequence')({ trialSessionId });
      }),
    );

    route(
      '/trial-session-working-copy/*',
      checkLoggedIn(trialSessionId => {
        document.title = `Trial Session Working Copy ${pageTitleSuffix}`;
        app.getSequence('gotoTrialSessionWorkingCopySequence')({
          trialSessionId,
        });
      }),
    );

    route(
      '/trial-sessions..',
      checkLoggedIn(() => {
        var query = {};
        forEach(route.query(), (value, key) => {
          set(query, key, value);
        });
        document.title = `Trial sessions ${pageTitleSuffix}`;
        app.getSequence('gotoTrialSessionsSequence')({ query });
      }),
    );

    route('/idle-logout', () => {
      app.getSequence('gotoIdleLogoutSequence')();
    });

    route('/log-in...', () => {
      const { code, path, token } = queryStringDecoder();
      if (code) {
        app.getSequence('loginWithCodeSequence')({ code, path });
      } else {
        app.getSequence('loginWithTokenSequence')({ path, token });
      }
    });

    route(
      '/before-filing-a-petition',
      checkLoggedIn(() => {
        document.title = `Before you file a petition ${pageTitleSuffix}`;
        app.getSequence('gotoBeforeStartCaseSequence')();
      }),
    );

    route(
      '/file-a-petition/step-*',
      checkLoggedIn(step => {
        document.title = `File a petition ${pageTitleSuffix}`;
        if (app.getState('currentPage') === 'StartCaseWizard') {
          app.getSequence('chooseStartCaseWizardStepSequence')({
            step: `${step}`,
            value: `StartCaseStep${step}`,
          });
        } else {
          switch (step) {
            case '1':
              app.getSequence('gotoStartCaseWizardSequence')({
                step,
                wizardStep: `StartCaseStep${step}`,
              });
              break;
            default:
              app.getSequence('navigateToPathSequence')({
                path: '/file-a-petition/step-1',
              });
          }
        }
      }),
    );

    route(
      '/file-a-petition-pa11y/step-*',
      checkLoggedIn(step => {
        document.title = `File a petition ${pageTitleSuffix}`;
        app.getSequence('gotoStartCaseWizardSequence')({
          step,
          wizardStep: `StartCaseStep${step}`,
        });
      }),
    );

    route(
      '/add-a-trial-session',
      checkLoggedIn(() => {
        document.title = `Add a trial session ${pageTitleSuffix}`;
        app.getSequence('gotoAddTrialSessionSequence')();
      }),
    );

    route('/style-guide', () => {
      document.title = `Style Guide ${pageTitleSuffix}`;
      app.getSequence('gotoStyleGuideSequence')();
    });

    route(
      '/messages..',
      checkLoggedIn(() => {
        const path = route._.getPathFromBase();
        const validPaths = [
          'messages',
          'messages/my',
          'messages/my/inbox',
          'messages/my/outbox',
          'messages/my/batched',
          'messages/section',
          'messages/section/inbox',
          'messages/section/outbox',
          'messages/section/batched',
        ];

        if (path && !validPaths.includes(path)) {
          app.getSequence('notFoundErrorSequence')({
            error: {},
          });
        } else {
          const routeArgs = {
            baseRoute: 'messages',
            workQueueIsInternal: true,
          };
          const pathParts = path.split('/');

          if (pathParts[1]) {
            routeArgs.queue = pathParts[1];
          }
          if (pathParts[2]) {
            routeArgs.box = pathParts[2];
          }

          app.getSequence('gotoMessagesSequence')(routeArgs);
        }
        document.title = `Messages ${pageTitleSuffix}`;
      }),
    );

    route(
      '/reports/case-deadlines',
      checkLoggedIn(() => {
        document.title = `Case Deadlines ${pageTitleSuffix}`;
        app.getSequence('gotoAllCaseDeadlinesSequence')();
      }),
    );

    route(
      '/user/contact/edit',
      checkLoggedIn(() => {
        document.title = `Edit User Contact ${pageTitleSuffix}`;
        app.getSequence('gotoUserContactEditSequence')();
      }),
    );

    route(
      '/search/no-matches',
      checkLoggedIn(() => {
        document.title = `Search Results ${pageTitleSuffix}`;
        app.getSequence('gotoCaseSearchNoMatchesSequence')();
      }),
    );

    route(
      '/search..',
      checkLoggedIn(() => {
        const query = route.query();
        document.title = `Advanced Search ${pageTitleSuffix}`;
        app.getSequence('gotoAdvancedSearchSequence')(query);
      }),
    );

    route('/mock-login...', () => {
      const { path, token } = queryStringDecoder();
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
        app.getSequence('notFoundErrorSequence')({
          error: {},
        });
      },
      true,
    );

    route.start(true);
  },
};

export {
  back,
  createObjectURL,
  externalRoute,
  openInNewTab,
  revokeObjectURL,
  route,
  router,
};
