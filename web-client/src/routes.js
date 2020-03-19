import { forEach, isEmpty, set } from 'lodash';
import { queryStringDecoder } from './utilities/queryStringDecoder';
import { setPageTitle } from './presenter/utilities/setPageTitle';

// Add this prefix to page titles for all pages that are related to a case
const getPageTitleDocketPrefix = docketNumber => {
  return `Docket ${docketNumber} | `;
};

const getRoutes = ({ app, ifHasAccess, ROLE_PERMISSIONS, route }) => {
  /* eslint sort-keys-fix/sort-keys-fix: 0 */
  return {
    '/': ifHasAccess(() => {
      setPageTitle('Dashboard');
      app.getSequence('gotoDashboardSequence')();
    }),
    '/case-detail/*': ifHasAccess(docketNumber => {
      setPageTitle(`Docket ${docketNumber}`);
      app.getSequence('gotoCaseDetailSequence')({
        docketNumber,
      });
    }),
    '/case-detail/*/case-information': ifHasAccess(docketNumber => {
      window.history.replaceState(null, null, `/case-detail/${docketNumber}`);
      setPageTitle(`Docket ${docketNumber}`);
      app.getSequence('gotoCaseDetailSequence')({
        docketNumber,
        primaryTab: 'caseInformation',
      });
    }),
    '/case-detail/*/documents/*': ifHasAccess((docketNumber, documentId) => {
      setPageTitle(
        `${getPageTitleDocketPrefix(docketNumber)} Document details`,
      );
      app.getSequence('gotoDocumentDetailSequence')({
        docketNumber,
        documentId,
      });
    }, ROLE_PERMISSIONS.UPDATE_CASE),
    '/case-detail/*/documents/*/edit-saved..': ifHasAccess(
      (docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(
            docketNumber,
          )} Edit saved document details`,
        );

        if (!isEmpty(app.getState('form'))) {
          const { tab } = route.query();

          app.getSequence('gotoEditSavedDocumentDetailSequence')({
            docketNumber,
            documentId,
            tab,
          });
        } else {
          app.getSequence('gotoDocumentDetailSequence')({
            docketNumber,
            documentId,
          });
        }
      },
      ROLE_PERMISSIONS.UPDATE_CASE,
    ),
    '/case-detail/*/edit-details': ifHasAccess(docketNumber => {
      setPageTitle(`Docket ${docketNumber}`);
      app.getSequence('gotoEditPetitionDetailsSequence')({
        docketNumber,
      });
    }),
    '/case-detail/*/edit-petitioner-information': ifHasAccess(docketNumber => {
      setPageTitle(`Docket ${docketNumber}`);
      app.getSequence('gotoEditPetitionerInformationSequence')({
        docketNumber,
      });
    }),
    '/case-detail/*?openModal=*': ifHasAccess((docketNumber, openModal) => {
      setPageTitle(`Docket ${docketNumber}`);
      app.getSequence('gotoCaseDetailSequence')({
        docketNumber,
        openModal,
      });
    }),
    '/case-detail/*/documents/*/review': ifHasAccess(
      (docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Document detail review`,
        );
        app.getSequence('gotoReviewSavedPetitionSequence')({
          caseId: docketNumber,
          docketNumber,
          documentId,
        });
      },
      ROLE_PERMISSIONS.UPDATE_CASE,
    ),
    '/case-detail/*/documents/*/complete': ifHasAccess(
      (docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Edit docket record`,
        );
        app.getSequence('gotoCompleteDocketEntrySequence')({
          docketNumber,
          documentId,
        });
      },
    ),
    '/case-detail/*/documents/*/edit': ifHasAccess(
      (docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Edit docket record`,
        );
        app.getSequence('gotoEditDocketEntrySequence')({
          docketNumber,
          documentId,
        });
      },
    ),
    '/case-detail/*/docket-entry/*/edit-meta': ifHasAccess(
      (docketNumber, docketRecordIndex) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Edit Docket Entry Meta`,
        );
        app.getSequence('gotoEditDocketEntryMetaSequence')({
          docketNumber,
          docketRecordIndex: +docketRecordIndex,
        });
      },
    ),
    '/case-detail/*/documents/*/edit-court-issued': ifHasAccess(
      (docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Edit docket entry`,
        );
        app.getSequence('gotoEditCourtIssuedDocketEntrySequence')({
          docketNumber,
          documentId,
        });
      },
    ),
    '/case-detail/*/documents/*/sign': ifHasAccess(
      (docketNumber, documentId) => {
        app.getSequence('gotoSignPDFDocumentSequence')({
          docketNumber,
          documentId,
          pageNumber: 1,
        });
      },
    ),
    '/case-detail/*/documents/*/messages/*/sign': ifHasAccess(
      (docketNumber, documentId, messageId) => {
        app.getSequence('gotoSignPDFDocumentSequence')({
          docketNumber,
          documentId,
          messageId,
          pageNumber: 1,
        });
      },
    ),
    '/case-detail/*/documents/*/mark/*': ifHasAccess(
      (docketNumber, documentId, workItemIdToMarkAsRead) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Document details`,
        );
        app.getSequence('gotoDocumentDetailSequence')({
          docketNumber,
          documentId,
          workItemIdToMarkAsRead,
        });
      },
    ),
    '/case-detail/*/documents/*/messages/*': ifHasAccess(
      (docketNumber, documentId, messageId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Document details`,
        );
        app.getSequence('gotoDocumentDetailSequence')({
          docketNumber,
          documentId,
          messageId,
        });
      },
    ),
    '/case-detail/*/documents/*/messages/*/mark/*': ifHasAccess(
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
    '/case-detail/*/before-you-file-a-document': ifHasAccess(docketNumber => {
      setPageTitle(
        `${getPageTitleDocketPrefix(docketNumber)} Before you file a document`,
      );
      app.getSequence('gotoBeforeYouFileDocumentSequence')({ docketNumber });
    }),
    '/case-detail/*/file-a-document': ifHasAccess(docketNumber => {
      setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} File a document`);
      if (app.getState('currentPage') === 'FileDocumentWizard') {
        app.getSequence('chooseWizardStepSequence')({
          value: 'SelectDocumentType',
        });
      } else {
        app.getSequence('gotoFileDocumentSequence')({ docketNumber });
      }
    }),
    '/case-detail/*/file-a-document/details': ifHasAccess(docketNumber => {
      setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} File a document`);
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
    '/case-detail/*/file-a-document/review': ifHasAccess(docketNumber => {
      setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} File a document`);
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
    '/case-detail/*/file-a-document/all-document-categories': ifHasAccess(
      docketNumber => {
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
      },
    ),
    '/case-detail/*/contacts/primary/edit': ifHasAccess(docketNumber => {
      setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Primary contact`);
      app.getSequence('gotoPrimaryContactEditSequence')({ docketNumber });
    }),
    '/case-detail/*/contacts/secondary/edit': ifHasAccess(docketNumber => {
      setPageTitle(
        `${getPageTitleDocketPrefix(docketNumber)} Secondary contact`,
      );
      app.getSequence('gotoSecondaryContactEditSequence')({ docketNumber });
    }),
    '/case-detail/*/create-order': ifHasAccess(docketNumber => {
      setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Create an order`);
      app.getSequence('gotoCreateOrderSequence')({ docketNumber });
    }),
    '/case-detail/*/upload-court-issued': ifHasAccess(docketNumber => {
      setPageTitle(
        `${getPageTitleDocketPrefix(docketNumber)} Upload a document`,
      );
      app.getSequence('gotoUploadCourtIssuedDocumentSequence')({
        docketNumber,
      });
    }),
    '/case-detail/*/edit-upload-court-issued/*': ifHasAccess(
      (docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Upload a document`,
        );
        app.getSequence('gotoEditUploadCourtIssuedDocumentSequence')({
          docketNumber,
          documentId,
        });
      },
    ),
    '/case-detail/*/edit-order/*': ifHasAccess(
      (docketNumber, documentIdToEdit) => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Edit an order`);
        const sequence = app.getSequence('gotoEditOrderSequence');
        sequence({
          docketNumber,
          documentIdToEdit,
        });
      },
    ),
    '/case-detail/*/edit-order/*/sign': ifHasAccess(
      (docketNumber, documentId) => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Edit an order`);
        const sequence = app.getSequence('gotoSignOrderSequence');
        sequence({
          docketNumber,
          documentId,
        });
      },
    ),
    '/case-detail/*/add-docket-entry': ifHasAccess(docketNumber => {
      setPageTitle(
        `${getPageTitleDocketPrefix(docketNumber)} Add docket entry`,
      );
      app.getSequence('gotoAddDocketEntrySequence')({ docketNumber });
    }),
    '/case-detail/*/documents/*/add-court-issued-docket-entry': ifHasAccess(
      (docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Add docket entry`,
        );
        app.getSequence('gotoAddCourtIssuedDocketEntrySequence')({
          docketNumber,
          documentId,
        });
      },
    ),
    '/case-detail/*/printable-docket-record': ifHasAccess(docketNumber => {
      setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Docket record`);
      app.getSequence('gotoPrintableDocketRecordSequence')({ docketNumber });
    }),
    '/case-detail/*/confirmation': ifHasAccess(docketNumber => {
      setPageTitle(
        `${getPageTitleDocketPrefix(docketNumber)} Case Confirmation`,
      );
      app.getSequence('gotoPrintableCaseConfirmationSequence')({
        docketNumber,
      });
    }),
    '/case-detail/*/pending-report': ifHasAccess(docketNumber => {
      setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Pending Report`);
      app.getSequence('gotoPrintablePendingReportForCaseSequence')({
        caseIdFilter: true,
        docketNumber,
      });
    }),
    '/case-detail/*/request-access': ifHasAccess(docketNumber => {
      setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Request access`);
      if (app.getState('wizardStep') === 'RequestAccessReview') {
        app.getSequence('chooseWizardStepSequence')({
          value: 'RequestAccess',
        });
      } else {
        app.getSequence('gotoRequestAccessSequence')({ docketNumber });
      }
    }),
    '/case-detail/*/request-access/review': ifHasAccess(docketNumber => {
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
    '/users/create-attorney': ifHasAccess(() => {
      setPageTitle('EF-CMS User Management - Create Attorney User');
      app.getSequence('gotoCreateAttorneyUserSequence')();
    }),
    '/users/edit-attorney/*': ifHasAccess(userId => {
      setPageTitle('EF-CMS User Management - Edit Attorney User');
      app.getSequence('gotoEditAttorneyUserSequence')({ userId });
    }),
    '/document-qc..': ifHasAccess(() => {
      const path = route._.getPathFromBase();
      const validPaths = [
        'document-qc',
        'document-qc/my',
        'document-qc/my/inbox',
        'document-qc/my/inProgress',
        'document-qc/my/outbox',
        'document-qc/section',
        'document-qc/section/inbox',
        'document-qc/section/inProgress',
        'document-qc/section/outbox',
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
      setPageTitle('Document QC');
    }),
    '/print-preview/*': ifHasAccess(docketNumber => {
      setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Print Service`);
      app.getSequence('gotoPrintPreviewSequence')({
        alertWarning: {
          message:
            'This case has parties receiving paper service. Print and mail all paper service documents below.',
          title: 'This document has been electronically served',
        },
        docketNumber,
      });
    }),
    '/trial-session-detail/*': ifHasAccess(trialSessionId => {
      setPageTitle('Trial session information');
      app.getSequence('gotoTrialSessionDetailSequence')({ trialSessionId });
    }, ROLE_PERMISSIONS.TRIAL_SESSIONS),
    '/trial-session-working-copy/*': ifHasAccess(trialSessionId => {
      setPageTitle('Trial session working copy');
      app.getSequence('gotoTrialSessionWorkingCopySequence')({
        trialSessionId,
      });
    }, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY),
    '/trial-session-planning-report': ifHasAccess(() => {
      setPageTitle('Trial session planning report');
      app.getSequence('gotoTrialSessionPlanningReportSequence')();
    }),
    '/trial-sessions..': ifHasAccess(() => {
      const trialSessionFilter = {};
      forEach(route.query(), (value, key) => {
        set(trialSessionFilter, key, value);
      });
      setPageTitle('Trial sessions');
      app.getSequence('gotoTrialSessionsSequence')({
        query: trialSessionFilter,
      });
    }, ROLE_PERMISSIONS.TRIAL_SESSIONS),
    '/idle-logout': () => {
      app.getSequence('gotoIdleLogoutSequence')();
    },
    '/log-in...': () => {
      const { code, path, token } = queryStringDecoder();
      if (code) {
        app.getSequence('loginWithCodeSequence')({ code, path });
      } else {
        app.getSequence('loginWithTokenSequence')({ path, token });
      }
    },
    '/before-filing-a-petition': ifHasAccess(() => {
      setPageTitle('Before you file a petition');
      app.getSequence('gotoBeforeStartCaseSequence')();
    }),
    '/file-a-petition/step-*': ifHasAccess(step => {
      setPageTitle('File a petition');
      if (app.getState('currentPage') === 'StartCaseWizard') {
        app.getSequence('chooseStartCaseWizardStepSequence')({
          step: `${step}`,
          value: `StartCaseStep${step}`,
        });
      } else {
        if (app.getState('currentPage') !== 'StartCaseInternal') {
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
      }
    }),
    'file-a-petition/review-petition': ifHasAccess(() => {
      setPageTitle('Review Petition');
      app.getSequence('gotoReviewPetitionFromPaperSequence')();
    }),
    '/file-a-petition-pa11y/step-*': ifHasAccess(step => {
      setPageTitle('File a petition');
      app.getSequence('gotoStartCaseWizardSequence')({
        step,
        wizardStep: `StartCaseStep${step}`,
      });
    }),
    '/add-a-trial-session': ifHasAccess(() => {
      setPageTitle('Add a trial session');
      app.getSequence('gotoAddTrialSessionSequence')();
    }, ROLE_PERMISSIONS.TRIAL_SESSIONS),
    '/edit-trial-session/*': ifHasAccess(trialSessionId => {
      setPageTitle('Edit trial session');
      app.getSequence('gotoEditTrialSessionSequence')({ trialSessionId });
    }, ROLE_PERMISSIONS.TRIAL_SESSIONS),
    '/style-guide': () => {
      setPageTitle('Style guide');
      app.getSequence('gotoStyleGuideSequence')();
    },
    '/accessibility-statement': () => {
      setPageTitle('Accessibility statement');
      app.getSequence('gotoAccessibilityStatementSequence')();
    },
    '/messages..': ifHasAccess(() => {
      const path = route._.getPathFromBase();
      const validPaths = [
        'messages',
        'messages/my',
        'messages/my/inbox',
        'messages/my/outbox',
        'messages/section',
        'messages/section/inbox',
        'messages/section/outbox',
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
    '/pdf-preview': ifHasAccess(() => {
      setPageTitle('PDF Preview');
      app.getSequence('gotoPdfPreviewSequence')();
    }),
    '/reports/case-inventory-report': ifHasAccess(() => {
      setPageTitle('Case Inventory Report');
      app.getSequence('gotoCaseInventoryReportSequence')();
    }),
    '/reports/case-deadlines': ifHasAccess(() => {
      setPageTitle('Case deadlines');
      app.getSequence('gotoAllCaseDeadlinesSequence')();
    }),
    '/reports/blocked-cases': ifHasAccess(() => {
      setPageTitle('Blocked cases');
      app.getSequence('gotoBlockedCasesReportSequence')();
    }),
    '/reports/pending-report': ifHasAccess(() => {
      setPageTitle('Pending report');
      app.getSequence('gotoPendingReportSequence')();
    }),
    '/reports/pending-report/printable..': ifHasAccess(() => {
      const { judgeFilter } = route.query();
      setPageTitle('Pending report');
      app.getSequence('gotoPrintablePendingReportSequence')({
        judgeFilter,
      });
    }),
    '/user/contact/edit': ifHasAccess(() => {
      setPageTitle('Edit user contact');
      app.getSequence('gotoUserContactEditSequence')();
    }),
    '/search/no-matches': ifHasAccess(() => {
      setPageTitle('Search results');
      app.getSequence('gotoCaseSearchNoMatchesSequence')();
    }, ROLE_PERMISSIONS.ADVANCED_SEARCH),
    '/search..': ifHasAccess(() => {
      const query = route.query();
      setPageTitle('Advanced search');
      app.getSequence('gotoAdvancedSearchSequence')(query);
    }, ROLE_PERMISSIONS.ADVANCED_SEARCH),
    '/mock-login...': () => {
      const { path, token } = queryStringDecoder();
      if (token) {
        setPageTitle('Mock login');
        app.getSequence('submitLoginSequence')({ path, token });
        return;
      }

      if (process.env.COGNITO) {
        setPageTitle('Dashboard');
        app.getSequence('gotoDashboardSequence')();
      } else {
        setPageTitle('Mock login');
        app.getSequence('gotoLoginSequence')();
      }
    },
    '..': () => {
      setPageTitle('Error');
      app.getSequence('notFoundErrorSequence')({
        error: {},
      });
    },
  };
};

export { getRoutes };
