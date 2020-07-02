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
  initialize: (app, registerRoute) => {
    window.document.title = 'U.S. Tax Court';
    const { ROLE_PERMISSIONS } = app.getState('constants');

    const ifHasAccess = (cb, permissionToCheck) => {
      return function () {
        const gotoLoginPage = () => {
          const path = app.getState('cognitoLoginUrl');
          externalRoute(path);
        };
        const goto404 = () => {
          return app.getSequence('navigateToPathSequence')({
            path: '404',
          });
        };

        if (!app.getState('user')) {
          return gotoLoginPage();
        } else {
          if (
            permissionToCheck &&
            !app.getState('permissions')[permissionToCheck]
          ) {
            goto404();
          } else {
            app.getSequence('clearAlertSequence')();
            return cb.apply(null, arguments);
          }
        }
      };
    };

    registerRoute(
      '/',
      ifHasAccess(() => {
        setPageTitle('Dashboard');
        return app.getSequence('gotoDashboardSequence')();
      }),
    );

    registerRoute(
      '/case-detail/*',
      ifHasAccess(docketNumber => {
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoCaseDetailSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/add-deficiency-statistics',
      ifHasAccess(docketNumber => {
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoAddDeficiencyStatisticsSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-deficiency-statistic/*',
      ifHasAccess((docketNumber, statisticId) => {
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoEditDeficiencyStatisticSequence')({
          docketNumber,
          statisticId,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/add-other-statistics',
      ifHasAccess(docketNumber => {
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoAddOtherStatisticsSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-other-statistics',
      ifHasAccess(docketNumber => {
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoEditOtherStatisticsSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*?openModal=*',
      ifHasAccess((docketNumber, openModal) => {
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoCaseDetailSequence')({
          docketNumber,
          openModal,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/case-information',
      ifHasAccess(docketNumber => {
        window.history.replaceState(null, null, `/case-detail/${docketNumber}`);
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoCaseDetailSequence')({
          docketNumber,
          primaryTab: 'caseInformation',
        });
      }),
    );

    registerRoute(
      '/case-detail/*/draft-documents',
      ifHasAccess(docketNumber => {
        window.history.replaceState(null, null, `/case-detail/${docketNumber}`);
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoCaseDetailSequence')({
          docketNumber,
          primaryTab: 'drafts',
        });
      }),
    );

    registerRoute(
      '/case-detail/*/document-view?..',
      ifHasAccess(docketNumber => {
        const { documentId } = route.query();
        window.history.replaceState(null, null, `/case-detail/${docketNumber}`);
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoCaseDetailSequence')({
          docketNumber,
          docketRecordTab: 'documentView',
          documentId,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-petitioner-information',
      ifHasAccess(docketNumber => {
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoEditPetitionerInformationSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-details',
      ifHasAccess(docketNumber => {
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoEditPetitionDetailsSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/petition-qc..',
      ifHasAccess(docketNumber => {
        const { tab } = route.query();
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Petition QC`);
        return app.getSequence('gotoPetitionQcSequence')({
          docketNumber,
          tab,
        });
      }, ROLE_PERMISSIONS.UPDATE_CASE),
    );

    registerRoute(
      '/case-detail/*/documents/*',
      ifHasAccess((docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Document details`,
        );
        return app.getSequence('gotoDocumentDetailSequence')({
          docketNumber,
          documentId,
        });
      }, ROLE_PERMISSIONS.UPDATE_CASE),
    );

    registerRoute(
      '/case-detail/*/documents/*/review',
      ifHasAccess((docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Document detail review`,
        );
        return app.getSequence('gotoReviewSavedPetitionSequence')({
          docketNumber,
          documentId,
        });
      }, ROLE_PERMISSIONS.UPDATE_CASE),
    );

    registerRoute(
      '/case-detail/*/documents/*/complete',
      ifHasAccess((docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Edit docket record`,
        );
        return app.getSequence('gotoCompleteDocketEntrySequence')({
          docketNumber,
          documentId,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/documents/*/edit',
      ifHasAccess((docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Edit docket record`,
        );
        return app.getSequence('gotoEditDocketEntrySequence')({
          docketNumber,
          documentId,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/docket-entry/*/edit-meta',
      ifHasAccess((docketNumber, docketRecordIndex) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Edit Docket Entry Meta`,
        );
        return app.getSequence('gotoEditDocketEntryMetaSequence')({
          docketNumber,
          docketRecordIndex: +docketRecordIndex,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/documents/*/edit-court-issued',
      ifHasAccess((docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Edit docket entry`,
        );
        return app.getSequence('gotoEditCourtIssuedDocketEntrySequence')({
          docketNumber,
          documentId,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/documents/*/sign',
      ifHasAccess((docketNumber, documentId) => {
        return app.getSequence('gotoSignPDFDocumentSequence')({
          docketNumber,
          documentId,
          pageNumber: 1,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/documents/*/messages/*/sign',
      ifHasAccess((docketNumber, documentId, messageId) => {
        return app.getSequence('gotoSignPDFDocumentSequence')({
          docketNumber,
          documentId,
          messageId,
          pageNumber: 1,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/documents/*/mark/*',
      ifHasAccess((docketNumber, documentId, workItemIdToMarkAsRead) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Document details`,
        );
        return app.getSequence('gotoDocumentDetailSequence')({
          docketNumber,
          documentId,
          workItemIdToMarkAsRead,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/documents/*/messages/*',
      ifHasAccess((docketNumber, documentId, messageId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Document details`,
        );
        return app.getSequence('gotoDocumentDetailSequence')({
          docketNumber,
          documentId,
          messageId,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/documents/*/messages/*/mark/*',
      ifHasAccess(
        (docketNumber, documentId, messageId, workItemIdToMarkAsRead) => {
          setPageTitle(
            `${getPageTitleDocketPrefix(docketNumber)} Document details`,
          );
          return app.getSequence('gotoDocumentDetailSequence')({
            docketNumber,
            documentId,
            messageId,
            workItemIdToMarkAsRead,
          });
        },
      ),
    );

    registerRoute(
      '/case-detail/*/before-you-file-a-document',
      ifHasAccess(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(
            docketNumber,
          )} Before you file a document`,
        );
        return app.getSequence('gotoBeforeYouFileDocumentSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/file-a-document',
      ifHasAccess(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} File a document`,
        );
        if (app.getState('currentPage') === 'FileDocumentWizard') {
          return app.getSequence('chooseWizardStepSequence')({
            value: 'SelectDocumentType',
          });
        } else {
          return app.getSequence('gotoFileDocumentSequence')({ docketNumber });
        }
      }),
    );

    registerRoute(
      '/case-detail/*/file-a-document/details',
      ifHasAccess(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} File a document`,
        );
        if (app.getState('currentPage') === 'FileDocumentWizard') {
          return app.getSequence('chooseWizardStepSequence')({
            value: 'FileDocument',
          });
        } else {
          return app.getSequence('navigateToPathSequence')({
            path: `/case-detail/${docketNumber}/file-a-document`,
          });
        }
      }),
    );

    registerRoute(
      '/case-detail/*/file-a-document/review',
      ifHasAccess(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} File a document`,
        );
        if (app.getState('currentPage') === 'FileDocumentWizard') {
          return app.getSequence('chooseWizardStepSequence')({
            value: 'FileDocumentReview',
          });
        } else {
          return app.getSequence('navigateToPathSequence')({
            path: `/case-detail/${docketNumber}/file-a-document`,
          });
        }
      }),
    );

    registerRoute(
      '/case-detail/*/file-a-document/all-document-categories',
      ifHasAccess(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} File a document`,
        );
        if (app.getState('currentPage') === 'FileDocumentWizard') {
          return app.getSequence('chooseWizardStepSequence')({
            value: 'ViewAllDocuments',
          });
        } else {
          return app.getSequence('navigateToPathSequence')({
            path: `/case-detail/${docketNumber}/file-a-document`,
          });
        }
      }),
    );

    registerRoute(
      '/case-detail/*/contacts/primary/edit',
      ifHasAccess(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Primary contact`,
        );
        return app.getSequence('gotoPrimaryContactEditSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/contacts/secondary/edit',
      ifHasAccess(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Secondary contact`,
        );
        return app.getSequence('gotoSecondaryContactEditSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/create-order',
      ifHasAccess(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Create an order`,
        );
        return app.getSequence('gotoCreateOrderSequence')({ docketNumber });
      }),
    );

    registerRoute(
      '/case-detail/*/create-order/*',
      ifHasAccess((docketNumber, parentMessageId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Create an order`,
        );
        return app.getSequence('gotoCreateOrderSequence')({
          docketNumber,
          parentMessageId,
          redirectUrl: `/case-messages/${docketNumber}/message-detail/${parentMessageId}`,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/upload-court-issued',
      ifHasAccess(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Upload a document`,
        );
        return app.getSequence('gotoUploadCourtIssuedDocumentSequence')({
          docketNumber,
        });
      }),
    );
    registerRoute(
      '/case-detail/*/edit-upload-court-issued/*',
      ifHasAccess((docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Upload a document`,
        );
        return app.getSequence('gotoEditUploadCourtIssuedDocumentSequence')({
          docketNumber,
          documentId,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/upload-correspondence',
      ifHasAccess(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Add Correspondence`,
        );
        return app.getSequence('gotoUploadCorrespondenceDocumentSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-correspondence/*',
      ifHasAccess((docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Edit Correspondence`,
        );
        return app.getSequence('gotoEditCorrespondenceDocumentSequence')({
          docketNumber,
          documentId,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-order/*/sign',
      ifHasAccess((docketNumber, documentId) => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Edit an order`);
        const sequence = app.getSequence('gotoSignOrderSequence');
        return sequence({
          docketNumber,
          documentId,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-order/*/sign/*',
      ifHasAccess((docketNumber, documentId, parentMessageId) => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Edit an order`);
        const sequence = app.getSequence('gotoSignOrderSequence');
        return sequence({
          docketNumber,
          documentId,
          parentMessageId,
          redirectUrl: `/case-messages/${docketNumber}/message-detail/${parentMessageId}`,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-order/*',
      ifHasAccess((docketNumber, documentIdToEdit) => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Edit an order`);
        const sequence = app.getSequence('gotoEditOrderSequence');
        return sequence({
          docketNumber,
          documentIdToEdit,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-order/*/*',
      ifHasAccess((docketNumber, documentIdToEdit, parentMessageId) => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Edit an order`);
        const sequence = app.getSequence('gotoEditOrderSequence');
        return sequence({
          docketNumber,
          documentIdToEdit,
          parentMessageId,
          redirectUrl: `/case-messages/${docketNumber}/message-detail/${parentMessageId}`,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/add-docket-entry',
      ifHasAccess(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Add docket entry`,
        );
        return app.getSequence('gotoAddDocketEntrySequence')({ docketNumber });
      }),
    );

    registerRoute(
      '/case-detail/*/documents/*/add-court-issued-docket-entry',
      ifHasAccess((docketNumber, documentId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Add docket entry`,
        );
        return app.getSequence('gotoAddCourtIssuedDocketEntrySequence')({
          docketNumber,
          documentId,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/documents/*/add-court-issued-docket-entry/*',
      ifHasAccess((docketNumber, documentId, parentMessageId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Add docket entry`,
        );
        const sequence = app.getSequence(
          'gotoAddCourtIssuedDocketEntrySequence',
        );
        return sequence({
          docketNumber,
          documentId,
          redirectUrl: `/case-messages/${docketNumber}/message-detail/${parentMessageId}`,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/printable-docket-record',
      ifHasAccess(docketNumber => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Docket record`);
        return app.getSequence('gotoPrintableDocketRecordSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/confirmation',
      ifHasAccess(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Case Confirmation`,
        );
        return app.getSequence('gotoPrintableCaseConfirmationSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/pending-report',
      ifHasAccess(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Pending Report`,
        );
        return app.getSequence('gotoPrintablePendingReportForCaseSequence')({
          caseIdFilter: true,
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/request-access',
      ifHasAccess(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Request access`,
        );
        if (app.getState('wizardStep') === 'RequestAccessReview') {
          return app.getSequence('chooseWizardStepSequence')({
            value: 'RequestAccess',
          });
        } else {
          return app.getSequence('gotoRequestAccessSequence')({ docketNumber });
        }
      }),
    );

    registerRoute(
      '/case-detail/*/request-access/review',
      ifHasAccess(docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Request access review`,
        );
        if (!app.getState('wizardStep')) {
          return app.getSequence('navigateToPathSequence')({
            path: `/case-detail/${docketNumber}/request-access`,
          });
        } else {
          return app.getSequence('chooseWizardStepSequence')({
            value: 'RequestAccessReview',
          });
        }
      }),
    );

    registerRoute(
      '/users/create-practitioner',
      ifHasAccess(() => {
        setPageTitle('EF-CMS User Management - Create Practitioner User');
        return app.getSequence('gotoCreatePractitionerUserSequence')();
      }),
    );

    registerRoute(
      '/users/edit-practitioner/*',
      ifHasAccess(barNumber => {
        setPageTitle('EF-CMS User Management - Edit Practitioner User');
        return app.getSequence('gotoEditPractitionerUserSequence')({
          barNumber,
        });
      }),
    );

    registerRoute(
      '/document-qc',
      ifHasAccess(() => {
        setPageTitle('Document QC');
        return app.getSequence('gotoMessagesSequence')({
          box: null,
          queue: null,
          workQueueIsInternal: false,
        });
      }),
    );

    registerRoute(
      '/document-qc/my',
      ifHasAccess(() => {
        setPageTitle('Document QC');
        return app.getSequence('gotoMessagesSequence')({
          box: null,
          queue: 'my',
          workQueueIsInternal: false,
        });
      }),
    );

    registerRoute(
      '/document-qc/my/inbox',
      ifHasAccess(() => {
        setPageTitle('Document QC');
        return app.getSequence('gotoMessagesSequence')({
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: false,
        });
      }),
    );

    registerRoute(
      '/document-qc/my/outbox',
      ifHasAccess(() => {
        setPageTitle('Document QC');
        return app.getSequence('gotoMessagesSequence')({
          box: 'outbox',
          queue: 'my',
          workQueueIsInternal: false,
        });
      }),
    );

    registerRoute(
      '/document-qc/my/inProgress',
      ifHasAccess(() => {
        setPageTitle('Document QC');
        return app.getSequence('gotoMessagesSequence')({
          box: 'inProgress',
          queue: 'my',
          workQueueIsInternal: false,
        });
      }),
    );

    registerRoute(
      '/document-qc/section',
      ifHasAccess(() => {
        setPageTitle('Document QC');
        return app.getSequence('gotoMessagesSequence')({
          box: null,
          queue: 'section',
          workQueueIsInternal: false,
        });
      }),
    );

    registerRoute(
      '/document-qc/section/inbox',
      ifHasAccess(() => {
        setPageTitle('Document QC');
        return app.getSequence('gotoMessagesSequence')({
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: false,
        });
      }),
    );

    registerRoute(
      '/document-qc/section/inProgress',
      ifHasAccess(() => {
        setPageTitle('Document QC');
        return app.getSequence('gotoMessagesSequence')({
          box: 'inProgress',
          queue: 'section',
          workQueueIsInternal: false,
        });
      }),
    );

    registerRoute(
      '/document-qc/section/outbox',
      ifHasAccess(() => {
        setPageTitle('Document QC');
        return app.getSequence('gotoMessagesSequence')({
          box: 'outbox',
          queue: 'section',
          workQueueIsInternal: false,
        });
      }),
    );

    registerRoute(
      '/practitioner-detail/*',
      ifHasAccess(barNumber => {
        setPageTitle('Practitioner Detail');
        return app.getSequence('gotoPractitionerDetailSequence')({
          barNumber,
        });
      }),
    );

    registerRoute(
      '/print-paper-service/*',
      ifHasAccess(docketNumber => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Print Service`);
        return app.getSequence('gotoPrintPaperServiceSequence')({
          alertWarning: {
            message:
              'Document electronically served. Print and mail all paper service documents now.',
          },
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/trial-session-detail/*',
      ifHasAccess(trialSessionId => {
        setPageTitle('Trial session information');
        return app.getSequence('gotoTrialSessionDetailSequence')({
          trialSessionId,
        });
      }, ROLE_PERMISSIONS.TRIAL_SESSIONS),
    );

    registerRoute(
      '/trial-session-working-copy/*',
      ifHasAccess(trialSessionId => {
        setPageTitle('Trial session working copy');
        return app.getSequence('gotoTrialSessionWorkingCopySequence')({
          trialSessionId,
        });
      }, ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY),
    );

    registerRoute(
      '/trial-session-planning-report',
      ifHasAccess(() => {
        setPageTitle('Trial session planning report');
        return app.getSequence('gotoTrialSessionPlanningReportSequence')();
      }),
    );

    registerRoute(
      '/trial-sessions..',
      ifHasAccess(() => {
        const trialSessionFilter = {};
        forEach(route.query(), (value, key) => {
          set(trialSessionFilter, key, value);
        });
        setPageTitle('Trial sessions');
        return app.getSequence('gotoTrialSessionsSequence')({
          query: trialSessionFilter,
        });
      }, ROLE_PERMISSIONS.TRIAL_SESSIONS),
    );

    registerRoute('/idle-logout', () => {
      return app.getSequence('gotoIdleLogoutSequence')();
    });

    registerRoute('/log-in...', () => {
      const { code, path, token } = queryStringDecoder();
      if (code) {
        return app.getSequence('loginWithCodeSequence')({ code, path });
      } else {
        return app.getSequence('loginWithTokenSequence')({ path, token });
      }
    });

    registerRoute(
      '/before-filing-a-petition',
      ifHasAccess(() => {
        setPageTitle('Before you file a petition');
        app.getSequence('gotoBeforeStartCaseSequence')();
      }),
    );

    registerRoute(
      '/file-a-petition/step-*',
      ifHasAccess(step => {
        setPageTitle('File a petition');
        if (app.getState('currentPage') === 'StartCaseWizard') {
          return app.getSequence('chooseStartCaseWizardStepSequence')({
            step: `${step}`,
            value: `StartCaseStep${step}`,
          });
        } else {
          if (app.getState('currentPage') !== 'StartCaseInternal') {
            switch (step) {
              case '1':
                return app.getSequence('gotoStartCaseWizardSequence')({
                  step,
                  wizardStep: `StartCaseStep${step}`,
                });
              default:
                return app.getSequence('navigateToPathSequence')({
                  path: '/file-a-petition/step-1',
                });
            }
          }
        }
      }),
    );

    registerRoute(
      '/file-a-petition/success',
      ifHasAccess(() => {
        setPageTitle('Petition Filed Successfully');
        return app.getSequence('gotoFilePetitionSuccessSequence')();
      }),
    );

    registerRoute(
      '/file-a-petition-pa11y/step-*',
      ifHasAccess(step => {
        setPageTitle('File a petition');
        return app.getSequence('gotoStartCaseWizardSequence')({
          step,
          wizardStep: `StartCaseStep${step}`,
        });
      }),
    );

    registerRoute(
      '/add-a-trial-session',
      ifHasAccess(() => {
        setPageTitle('Add a trial session');
        return app.getSequence('gotoAddTrialSessionSequence')();
      }, ROLE_PERMISSIONS.TRIAL_SESSIONS),
    );

    registerRoute(
      '/edit-trial-session/*',
      ifHasAccess(trialSessionId => {
        setPageTitle('Edit trial session');
        return app.getSequence('gotoEditTrialSessionSequence')({
          trialSessionId,
        });
      }, ROLE_PERMISSIONS.TRIAL_SESSIONS),
    );

    registerRoute('/style-guide', () => {
      setPageTitle('Style guide');
      return app.getSequence('gotoStyleGuideSequence')();
    });

    registerRoute('/accessibility-statement', () => {
      setPageTitle('Accessibility statement');
      return app.getSequence('gotoAccessibilityStatementSequence')();
    });

    registerRoute(
      '/messages',
      ifHasAccess(() => {
        setPageTitle('Messages');
        return app.getSequence('gotoMessagesSequence')({
          box: null,
          queue: null,
          workQueueIsInternal: true,
        });
      }),
    );

    registerRoute(
      '/messages/my',
      ifHasAccess(() => {
        setPageTitle('Messages');
        return app.getSequence('gotoMessagesSequence')({
          box: null,
          queue: 'my',
          workQueueIsInternal: true,
        });
      }),
    );

    registerRoute(
      '/messages/section',
      ifHasAccess(() => {
        setPageTitle('Messages');
        return app.getSequence('gotoMessagesSequence')({
          box: null,
          queue: 'section',
          workQueueIsInternal: true,
        });
      }),
    );

    registerRoute(
      '/messages/my/inbox',
      ifHasAccess(() => {
        setPageTitle('Messages');
        return app.getSequence('gotoMessagesSequence')({
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        });
      }),
    );

    registerRoute(
      '/messages/my/outbox',
      ifHasAccess(() => {
        setPageTitle('Messages');
        return app.getSequence('gotoMessagesSequence')({
          box: 'outbox',
          queue: 'my',
          workQueueIsInternal: true,
        });
      }),
    );

    registerRoute(
      '/messages/section/inbox',
      ifHasAccess(() => {
        setPageTitle('Messages');
        return app.getSequence('gotoMessagesSequence')({
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: true,
        });
      }),
    );

    registerRoute(
      '/messages/section/outbox',
      ifHasAccess(() => {
        setPageTitle('Messages');
        return app.getSequence('gotoMessagesSequence')({
          box: 'outbox',
          queue: 'section',
          workQueueIsInternal: true,
        });
      }),
    );

    registerRoute(
      '/case-messages/*/*',
      ifHasAccess((queue, box) => {
        setPageTitle('Messages');
        return app.getSequence('gotoCaseMessagesSequence')({
          box,
          queue,
        });
      }),
    );

    registerRoute(
      '/case-messages/*/message-detail/*',
      ifHasAccess((docketNumber, parentMessageId) => {
        setPageTitle('Message detail');
        return app.getSequence('gotoMessageDetailSequence')({
          docketNumber,
          parentMessageId,
        });
      }),
    );

    registerRoute(
      '/pdf-preview',
      ifHasAccess(() => {
        setPageTitle('PDF Preview');
        return app.getSequence('gotoPdfPreviewSequence')();
      }),
    );

    registerRoute(
      '/reports/case-inventory-report',
      ifHasAccess(() => {
        setPageTitle('Case Inventory Report');
        return app.getSequence('gotoCaseInventoryReportSequence')();
      }),
    );

    registerRoute(
      '/reports/case-deadlines',
      ifHasAccess(() => {
        setPageTitle('Case deadlines');
        return app.getSequence('gotoAllCaseDeadlinesSequence')();
      }),
    );

    registerRoute(
      '/reports/blocked-cases',
      ifHasAccess(() => {
        setPageTitle('Blocked cases');
        return app.getSequence('gotoBlockedCasesReportSequence')();
      }),
    );

    registerRoute(
      '/reports/pending-report',
      ifHasAccess(() => {
        setPageTitle('Pending report');
        return app.getSequence('gotoPendingReportSequence')();
      }),
    );

    registerRoute(
      '/reports/pending-report/printable..',
      ifHasAccess(() => {
        const { judgeFilter } = route.query();
        setPageTitle('Pending report');
        return app.getSequence('gotoPrintablePendingReportSequence')({
          judgeFilter,
        });
      }),
    );

    registerRoute(
      '/user/contact/edit',
      ifHasAccess(() => {
        setPageTitle('Edit user contact');
        return app.getSequence('gotoUserContactEditSequence')();
      }),
    );

    registerRoute(
      '/search/no-matches',
      ifHasAccess(() => {
        setPageTitle('Search results');
        return app.getSequence('gotoCaseSearchNoMatchesSequence')();
      }, ROLE_PERMISSIONS.ADVANCED_SEARCH),
    );

    registerRoute(
      '/search..',
      ifHasAccess(() => {
        const query = route.query();
        setPageTitle('Advanced search');
        return app.getSequence('gotoAdvancedSearchSequence')(query);
      }, ROLE_PERMISSIONS.ADVANCED_SEARCH),
    );

    registerRoute('/mock-login...', () => {
      const { path, token } = queryStringDecoder();
      if (token) {
        setPageTitle('Mock login');
        return app.getSequence('submitLoginSequence')({ path, token });
      }

      if (process.env.COGNITO) {
        setPageTitle('Dashboard');
        return app.getSequence('gotoDashboardSequence')();
      } else {
        setPageTitle('Mock login');
        return app.getSequence('gotoLoginSequence')();
      }
    });

    registerRoute(
      '..',
      () => {
        setPageTitle('Error');
        return app.getSequence('notFoundErrorSequence')({
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
