import { forEach, set } from 'lodash';
import { queryStringDecoder } from './utilities/queryStringDecoder';
import { setPageTitle } from './presenter/utilities/setPageTitle';
import route from 'riot-route';

route.base('/');

// Add this prefix to page titles for all pages that are related to a case
const getPageTitleDocketPrefix = docketNumber => {
  return `Docket ${docketNumber} | `;
};

const externalRoute = path => {
  window.location.replace(path);
};

const openInNewTab = (path, noopener = true) => {
  const windowFeatures = (noopener && 'noopener, noreferrer') || '';
  window.open(path, '_blank', windowFeatures);
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
        setPageTitle('Dashboard');
        app.getSequence('gotoDashboardSequence')();
      }),
    );

    route(
      '/case-detail/*',
      checkLoggedIn(docketNumber => {
        setPageTitle(`Docket ${docketNumber}`);
        app.getSequence('gotoCaseDetailSequence')({ docketNumber });
      }),
    );

    route(
      '/case-detail/*/documents/*',
      checkLoggedIn((docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Document details`,
        );
        app.getSequence('gotoDocumentDetailSequence')({
          docketNumber,
          documentId,
        });
      }),
    );

    route(
      '/case-detail/*/documents/*/complete',
      checkLoggedIn((docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Edit docket record`,
        );
        app.getSequence('gotoCompleteDocketEntrySequence')({
          docketNumber,
          documentId,
        });
      }),
    );

    route(
      '/case-detail/*/documents/*/edit',
      checkLoggedIn((docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Edit docket record`,
        );
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
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Document details`,
        );
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
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Document details`,
        );
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
          setPageTitle(
            `${getPageTitleDocketPrefix(docketNumber)} Document details`,
          );
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
        setPageTitle(
          `${getPageTitleDocketPrefix(
            docketNumber,
          )} Before you file a document`,
        );
        app.getSequence('gotoBeforeYouFileDocumentSequence')({ docketNumber });
      }),
    );

    route(
      '/case-detail/*/file-a-document',
      checkLoggedIn(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} File a document`,
        );
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
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} File a document`,
        );
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
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} File a document`,
        );
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
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} File a document`,
        );
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
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Primary contact`,
        );
        app.getSequence('gotoPrimaryContactEditSequence')({ docketNumber });
      }),
    );
    route(
      '/case-detail/*/create-order',
      checkLoggedIn(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Create an order`,
        );
        app.getSequence('gotoCreateOrderSequence')({ docketNumber });
      }),
    );

    route(
      '/case-detail/*/edit-order/*',
      checkLoggedIn((docketNumber, documentIdToEdit) => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Edit an order`);
        const sequence = app.getSequence('gotoEditOrderSequence');
        sequence({
          docketNumber,
          documentIdToEdit,
        });
      }),
    );

    route(
      '/case-detail/*/edit-order/*/sign',
      checkLoggedIn((docketNumber, documentId) => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Edit an order`);
        const sequence = app.getSequence('gotoSignOrderSequence');
        sequence({
          docketNumber,
          documentId,
        });
      }),
    );

    route(
      '/case-detail/*/add-docket-entry',
      checkLoggedIn(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Add docket entry`,
        );
        app.getSequence('gotoAddDocketEntrySequence')({ docketNumber });
      }),
    );

    route(
      '/case-detail/*/printable-docket-record',
      checkLoggedIn(docketNumber => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Docket record`);
        app.getSequence('gotoPrintableDocketRecordSequence')({ docketNumber });
      }),
    );

    route(
      '/case-detail/*/confirmation',
      checkLoggedIn(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Case Confirmation`,
        );
        app.getSequence('gotoPrintableCaseConfirmationSequence')({
          docketNumber,
        });
      }),
    );

    route(
      '/case-detail/*/request-access',
      checkLoggedIn(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Request access`,
        );
        if (app.getState('wizardStep') === 'RequestAccessReview') {
          app.getSequence('chooseWizardStepSequence')({
            value: 'RequestAccess',
          });
        } else {
          app.getSequence('gotoRequestAccessSequence')({ docketNumber });
        }
      }),
    );

    route(
      '/case-detail/*/request-access/review',
      checkLoggedIn(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Request access review`,
        );
        if (!app.getState('wizardStep')) {
          app.getSequence('navigateToPathSequence')({
            path: `/case-detail/${docketNumber}/request-access`,
          });
        } else {
          app.getSequence('chooseWizardStepSequence')({
            value: 'RequestAccessReview',
          });
        }
      }),
    );

    route(
      '/case-detail/*/orders-needed',
      checkLoggedIn(docketNumber => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Orders needed`);
        app.getSequence('gotoOrdersNeededSequence')({ docketNumber });
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
            workQueueIsInternal: false,
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
        setPageTitle('Messages');
      }),
    );

    route(
      '/trial-session-detail/*',
      checkLoggedIn(trialSessionId => {
        setPageTitle('Trial session information');
        app.getSequence('gotoTrialSessionDetailSequence')({ trialSessionId });
      }),
    );

    route(
      '/trial-session-working-copy/*',
      checkLoggedIn(trialSessionId => {
        setPageTitle('Trial session working copy');
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
        setPageTitle('Trial sessions');
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
        setPageTitle('Before you file a petition');
        app.getSequence('gotoBeforeStartCaseSequence')();
      }),
    );

    route(
      '/file-a-petition/step-*',
      checkLoggedIn(step => {
        setPageTitle('File a petition');
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
        setPageTitle('File a petition');
        app.getSequence('gotoStartCaseWizardSequence')({
          step,
          wizardStep: `StartCaseStep${step}`,
        });
      }),
    );

    route(
      '/add-a-trial-session',
      checkLoggedIn(() => {
        setPageTitle('Add a trial session');
        app.getSequence('gotoAddTrialSessionSequence')();
      }),
    );

    route('/style-guide', () => {
      setPageTitle('Style guide');
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
        setPageTitle('Messages');
      }),
    );

    route(
      '/reports/case-deadlines',
      checkLoggedIn(() => {
        setPageTitle('Case deadlines');
        app.getSequence('gotoAllCaseDeadlinesSequence')();
      }),
    );

    route(
      '/reports/blocked-cases',
      checkLoggedIn(() => {
        setPageTitle('Blocked cases');
        app.getSequence('gotoBlockedCasesReportSequence')();
      }),
    );

    route(
      '/user/contact/edit',
      checkLoggedIn(() => {
        setPageTitle('Edit user contact');
        app.getSequence('gotoUserContactEditSequence')();
      }),
    );

    route(
      '/search/no-matches',
      checkLoggedIn(() => {
        setPageTitle('Search results');
        app.getSequence('gotoCaseSearchNoMatchesSequence')();
      }),
    );

    route(
      '/search..',
      checkLoggedIn(() => {
        const query = route.query();
        setPageTitle('Advanced search');
        app.getSequence('gotoAdvancedSearchSequence')(query);
      }),
    );

    route('/mock-login...', () => {
      const { path, token } = queryStringDecoder();
      if (token) {
        setPageTitle('Mock login');
        app.getSequence('submitLoginSequence')({ path, token });
        return;
      }

      if (process.env.COGNITO) {
        // USTC_ENV is undefined in prod
        setPageTitle('Dashboard');
        app.getSequence('gotoDashboardSequence')();
      } else {
        setPageTitle('Mock login');
        app.getSequence('gotoLoginSequence')();
      }
    });

    route(
      '..',
      () => {
        setPageTitle('Error');
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
