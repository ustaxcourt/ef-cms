/* eslint-disable max-lines */
import { forEach, set } from 'lodash';
import { queryStringDecoder } from './utilities/queryStringDecoder';
import { setPageTitle } from './presenter/utilities/setPageTitle';
import route from 'riot-route';

const BASE_ROUTE = '/';

route.base(BASE_ROUTE);

// Add this prefix to page titles for all pages that are related to a case
const getPageTitleDocketPrefix = docketNumber => {
  return `Docket ${docketNumber} | `;
};

const externalRoute = path => {
  window.location.replace(path);
};

const openInNewTab = (path, noopener = true, target = '_blank') => {
  const windowFeatures = (noopener && 'noopener, noreferrer') || '';
  window.open(path, target, windowFeatures);
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

const gotoLoginPage = app => {
  const path = app.getState('cognitoLoginUrl');
  externalRoute(path);
};
const goto404 = app => {
  return app.getSequence('navigateToPathSequence')({
    path: '404',
  });
};
const accessRedirects = { goto404, gotoLoginPage };

const ifHasAccess = (
  { app, permissionToCheck, redirect = accessRedirects },
  cb,
) => {
  return function () {
    if (!app.getState('user')) {
      return redirect.gotoLoginPage(app);
    } else {
      if (
        permissionToCheck &&
        !app.getState('permissions')[permissionToCheck]
      ) {
        redirect.goto404(app);
      } else {
        app.getSequence('clearAlertSequence')();
        return cb.apply(null, arguments);
      }
    }
  };
};

const router = {
  initialize: (app, registerRoute) => {
    setPageTitle('U.S. Tax Court');
    // expose route function on window for use with cypress
    // eslint-disable-next-line no-underscore-dangle
    window.__cy_route = path => route(path || '/');
    const { ROLE_PERMISSIONS } = app.getState('constants');

    registerRoute(
      '/',
      ifHasAccess({ app }, () => {
        setPageTitle('Dashboard');
        return app.getSequence('gotoDashboardSequence')();
      }),
    );

    registerRoute(
      '/case-detail/*',
      ifHasAccess({ app }, docketNumber => {
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoCaseDetailSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/add-deficiency-statistics',
      ifHasAccess({ app }, docketNumber => {
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoAddDeficiencyStatisticsSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-deficiency-statistic/*',
      ifHasAccess({ app }, (docketNumber, statisticId) => {
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoEditDeficiencyStatisticSequence')({
          docketNumber,
          statisticId,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/add-other-statistics',
      ifHasAccess({ app }, docketNumber => {
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoAddOtherStatisticsSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-other-statistics',
      ifHasAccess({ app }, docketNumber => {
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoEditOtherStatisticsSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/add-petitioner-to-case',
      ifHasAccess({ app }, docketNumber => {
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoAddPetitionerToCaseSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*?openModal=*',
      ifHasAccess({ app }, (docketNumber, openModal) => {
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoCaseDetailSequence')({
          docketNumber,
          openModal,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/case-information',
      ifHasAccess({ app }, docketNumber => {
        window.history.replaceState(null, null, `/case-detail/${docketNumber}`);
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoCaseDetailSequence')({
          docketNumber,
          primaryTab: 'caseInformation',
        });
      }),
    );

    registerRoute(
      '/case-detail/*/case-information?..',
      ifHasAccess({ app }, docketNumber => {
        const { caseInformationTab, partiesTab } = route.query();
        window.history.replaceState(null, null, `/case-detail/${docketNumber}`);
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoCaseDetailSequence')({
          caseInformationTab,
          docketNumber,
          partiesTab,
          primaryTab: 'caseInformation',
        });
      }),
    );

    registerRoute(
      '/case-detail/*/draft-documents',
      ifHasAccess({ app }, docketNumber => {
        window.history.replaceState(null, null, `/case-detail/${docketNumber}`);
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoCaseDetailSequence')({
          docketNumber,
          primaryTab: 'drafts',
        });
      }),
    );

    registerRoute(
      '/case-detail/*/draft-documents?..',
      ifHasAccess({ app }, docketNumber => {
        const { docketEntryId } = route.query();
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoCaseDetailSequence')({
          docketEntryId,
          docketNumber,
          primaryTab: 'drafts',
        });
      }),
    );

    registerRoute(
      '/case-detail/*/document-view?..',
      ifHasAccess({ app }, docketNumber => {
        const { docketEntryId } = route.query();
        window.history.replaceState(null, null, `/case-detail/${docketNumber}`);
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoCaseDetailSequence')({
          docketEntryId,
          docketNumber,
          docketRecordTab: 'documentView',
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-petitioner-information/*',
      ifHasAccess({ app }, (docketNumber, contactId) => {
        setPageTitle('Edit Petitioner Information');
        return app.getSequence('gotoEditPetitionerInformationInternalSequence')(
          {
            contactId,
            docketNumber,
          },
        );
      }),
    );

    registerRoute(
      '/case-detail/*/edit-petitioner-counsel/*',
      ifHasAccess({ app }, (docketNumber, barNumber) => {
        setPageTitle('Edit Petitioner Counsel');
        return app.getSequence('gotoEditPetitionerCounselSequence')({
          barNumber,
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-respondent-counsel/*',
      ifHasAccess({ app }, (docketNumber, barNumber) => {
        setPageTitle('Edit Respondent Counsel');
        return app.getSequence('gotoEditRespondentCounselSequence')({
          barNumber,
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-details',
      ifHasAccess({ app }, docketNumber => {
        setPageTitle(`Docket ${docketNumber}`);
        return app.getSequence('gotoEditCaseDetailsSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/petition-qc/document-view/*',
      ifHasAccess(
        { app, permissionToCheck: ROLE_PERMISSIONS.UPDATE_CASE },
        (docketNumber, docketEntryId) => {
          setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Petition QC`);
          return app.getSequence('gotoPetitionQcSequence')({
            docketNumber,
            redirectUrl: `/case-detail/${docketNumber}/document-view?docketEntryId=${docketEntryId}`,
          });
        },
      ),
    );

    registerRoute(
      '/case-detail/*/petition-qc/*',
      ifHasAccess(
        { app, permissionToCheck: ROLE_PERMISSIONS.UPDATE_CASE },
        (docketNumber, parentMessageId) => {
          setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Petition QC`);
          return app.getSequence('gotoPetitionQcSequence')({
            docketNumber,
            redirectUrl: `/messages/${docketNumber}/message-detail/${parentMessageId}`,
          });
        },
      ),
    );

    registerRoute(
      '/case-detail/*/petition-qc..',
      ifHasAccess(
        { app, permissionToCheck: ROLE_PERMISSIONS.UPDATE_CASE },
        docketNumber => {
          const { tab } = route.query();
          setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Petition QC`);
          return app.getSequence('gotoPetitionQcSequence')({
            docketNumber,
            tab,
          });
        },
      ),
    );

    registerRoute(
      '/case-detail/*/documents/*/review',
      ifHasAccess(
        { app, permissionToCheck: ROLE_PERMISSIONS.UPDATE_CASE },
        (docketNumber, docketEntryId) => {
          setPageTitle(
            `${getPageTitleDocketPrefix(docketNumber)} Document detail review`,
          );
          return app.getSequence('gotoReviewSavedPetitionSequence')({
            docketEntryId,
            docketNumber,
          });
        },
      ),
    );

    registerRoute(
      '/case-detail/*/documents/*/complete',
      ifHasAccess({ app }, (docketNumber, docketEntryId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Edit docket entry`,
        );
        return app.getSequence('gotoEditPaperFilingSequence')({
          docketEntryId,
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/documents/*/edit',
      ifHasAccess({ app }, (docketNumber, docketEntryId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Edit docket entry`,
        );
        return app.getSequence('gotoDocketEntryQcSequence')({
          docketEntryId,
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/docket-entry/*/edit-meta',
      ifHasAccess({ app }, (docketNumber, docketRecordIndex) => {
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
      ifHasAccess({ app }, (docketNumber, docketEntryId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Edit docket entry`,
        );
        return app.getSequence('gotoEditCourtIssuedDocketEntrySequence')({
          docketEntryId,
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/before-you-file-a-document',
      ifHasAccess({ app }, docketNumber => {
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
      ifHasAccess({ app }, docketNumber => {
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
      ifHasAccess({ app }, docketNumber => {
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
      ifHasAccess({ app }, docketNumber => {
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
      ifHasAccess({ app }, docketNumber => {
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
      '/case-detail/*/contacts/*/edit',
      ifHasAccess({ app }, (docketNumber, contactId) => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Contact`);
        return app.getSequence('gotoContactEditSequence')({
          contactId,
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/create-order?..',
      ifHasAccess({ app }, docketNumber => {
        const { documentTitle, documentType, eventCode } = route.query();
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Create an order`,
        );
        return app.getSequence('gotoCreateOrderSequence')({
          docketNumber,
          documentTitle: decodeURIComponent(documentTitle),
          documentType: decodeURIComponent(documentType),
          eventCode,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/create-order/*?..',
      ifHasAccess({ app }, (docketNumber, parentMessageId) => {
        const { documentTitle, documentType, eventCode } = route.query();
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Create an order`,
        );
        return app.getSequence('gotoCreateOrderSequence')({
          docketNumber,
          documentTitle: decodeURIComponent(documentTitle),
          documentType: decodeURIComponent(documentType),
          eventCode,
          parentMessageId,
          redirectUrl: `/messages/${docketNumber}/message-detail/${parentMessageId}`,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/upload-court-issued',
      ifHasAccess({ app }, docketNumber => {
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
      ifHasAccess({ app }, (docketNumber, docketEntryId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Upload a document`,
        );
        return app.getSequence('gotoEditUploadCourtIssuedDocumentSequence')({
          docketEntryId,
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-upload-court-issued/*/*',
      ifHasAccess({ app }, (docketNumber, docketEntryId, parentMessageId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Upload a document`,
        );
        return app.getSequence('gotoEditUploadCourtIssuedDocumentSequence')({
          docketEntryId,
          docketNumber,
          redirectUrl: `/messages/${docketNumber}/message-detail/${parentMessageId}`,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/correspondence',
      ifHasAccess({ app }, docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Correspondence`,
        );
        return app.getSequence('gotoCaseDetailSequence')({
          docketNumber,
          primaryTab: 'correspondence',
        });
      }),
    );

    registerRoute(
      '/case-detail/*/correspondence?..',
      ifHasAccess({ app }, docketNumber => {
        const { correspondenceId } = route.query();
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Correspondence`,
        );
        return app.getSequence('gotoCaseDetailSequence')({
          correspondenceDocumentId: correspondenceId,
          docketNumber,
          primaryTab: 'correspondence',
        });
      }),
    );

    registerRoute(
      '/case-detail/*/upload-correspondence',
      ifHasAccess({ app }, docketNumber => {
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
      ifHasAccess({ app }, (docketNumber, correspondenceId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Edit Correspondence`,
        );
        return app.getSequence('gotoEditCorrespondenceDocumentSequence')({
          correspondenceId,
          docketNumber,
          redirectUrl: `/case-detail/${docketNumber}/correspondence?correspondenceId=${correspondenceId}`,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-correspondence/*/*',
      ifHasAccess(
        { app },
        (docketNumber, correspondenceId, parentMessageId) => {
          setPageTitle(
            `${getPageTitleDocketPrefix(docketNumber)} Edit Correspondence`,
          );
          return app.getSequence('gotoEditCorrespondenceDocumentSequence')({
            correspondenceId,
            docketNumber,
            redirectUrl: `/messages/${docketNumber}/message-detail/${parentMessageId}`,
          });
        },
      ),
    );

    registerRoute(
      '/case-detail/*/edit-order/*/sign',
      ifHasAccess({ app }, (docketNumber, docketEntryId) => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Edit an order`);
        const sequence = app.getSequence('gotoSignOrderSequence');
        return sequence({
          docketEntryId,
          docketNumber,
          redirectUrl: `/case-detail/${docketNumber}/draft-documents?docketEntryId=${docketEntryId}`,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-order/*/sign/*',
      ifHasAccess({ app }, (docketNumber, docketEntryId, parentMessageId) => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Edit an order`);
        const sequence = app.getSequence('gotoSignOrderSequence');
        return sequence({
          docketEntryId,
          docketNumber,
          parentMessageId,
          redirectUrl: `/messages/${docketNumber}/message-detail/${parentMessageId}?documentId=${docketEntryId}`,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-order/*',
      ifHasAccess({ app }, (docketNumber, docketEntryIdToEdit) => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Edit an order`);
        const sequence = app.getSequence('gotoEditOrderSequence');
        return sequence({
          docketEntryIdToEdit,
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/edit-order/*/*',
      ifHasAccess(
        { app },
        (docketNumber, docketEntryIdToEdit, parentMessageId) => {
          setPageTitle(
            `${getPageTitleDocketPrefix(docketNumber)} Edit an order`,
          );
          const sequence = app.getSequence('gotoEditOrderSequence');
          return sequence({
            docketEntryIdToEdit,
            docketNumber,
            parentMessageId,
            redirectUrl: `/messages/${docketNumber}/message-detail/${parentMessageId}`,
          });
        },
      ),
    );

    registerRoute(
      '/case-detail/*/add-paper-filing',
      ifHasAccess({ app }, docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Add paper filing`,
        );
        return app.getSequence('gotoAddPaperFilingSequence')({ docketNumber });
      }),
    );

    registerRoute(
      '/case-detail/*/documents/*/add-court-issued-docket-entry',
      ifHasAccess({ app }, (docketNumber, docketEntryId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Add docket entry`,
        );
        return app.getSequence('gotoAddCourtIssuedDocketEntrySequence')({
          docketEntryId,
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/documents/*/add-court-issued-docket-entry/*',
      ifHasAccess({ app }, (docketNumber, docketEntryId, parentMessageId) => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Add docket entry`,
        );
        const sequence = app.getSequence(
          'gotoAddCourtIssuedDocketEntrySequence',
        );
        return sequence({
          docketEntryId,
          docketNumber,
          redirectUrl: `/messages/${docketNumber}/message-detail/${parentMessageId}?documentId=${docketEntryId}`,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/printable-docket-record',
      ifHasAccess({ app }, docketNumber => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Docket record`);
        return app.getSequence('gotoPrintableDocketRecordSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/confirmation',
      ifHasAccess({ app }, docketNumber => {
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
      ifHasAccess({ app }, docketNumber => {
        setPageTitle(
          `${getPageTitleDocketPrefix(docketNumber)} Pending Report`,
        );
        return app.getSequence('gotoPrintablePendingReportForCaseSequence')({
          docketNumber,
          docketNumberFilter: true,
        });
      }),
    );

    registerRoute(
      '/case-detail/*/request-access',
      ifHasAccess({ app }, docketNumber => {
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
      ifHasAccess({ app }, docketNumber => {
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
      '/change-login-and-service-email',
      ifHasAccess({ app }, () => {
        setPageTitle('Change Login & Service Email Address');
        return app.getSequence('gotoChangeLoginAndServiceEmailSequence')();
      }),
    );

    registerRoute(
      '/users/create-practitioner',
      ifHasAccess({ app }, () => {
        setPageTitle('EF-CMS User Management - Create Practitioner User');
        return app.getSequence('gotoCreatePractitionerUserSequence')();
      }),
    );

    registerRoute(
      '/users/edit-practitioner/*',
      ifHasAccess({ app }, barNumber => {
        setPageTitle('EF-CMS User Management - Edit Practitioner User');
        return app.getSequence('gotoEditPractitionerUserSequence')({
          barNumber,
        });
      }),
    );

    registerRoute(
      '/document-qc',
      ifHasAccess({ app }, () => {
        setPageTitle('Document QC');
        return app.getSequence('gotoWorkQueueSequence')({
          box: null,
          queue: null,
        });
      }),
    );

    registerRoute(
      '/my-account',
      ifHasAccess({ app }, () => {
        setPageTitle('My Account');
        return app.getSequence('gotoMyAccountSequence')();
      }),
    );

    registerRoute('/verify-email..', () => {
      setPageTitle('Verify Email');
      const { token } = route.query();
      return app.getSequence('gotoVerifyEmailSequence')({
        token,
      });
    });

    registerRoute(
      '/document-qc/my',
      ifHasAccess({ app }, () => {
        setPageTitle('Document QC');
        return app.getSequence('gotoWorkQueueSequence')({
          box: null,
          queue: 'my',
        });
      }),
    );

    registerRoute(
      '/document-qc/my/inbox',
      ifHasAccess({ app }, () => {
        setPageTitle('Document QC');
        return app.getSequence('gotoWorkQueueSequence')({
          box: 'inbox',
          queue: 'my',
        });
      }),
    );

    registerRoute(
      '/document-qc/my/outbox',
      ifHasAccess({ app }, () => {
        setPageTitle('Document QC');
        return app.getSequence('gotoWorkQueueSequence')({
          box: 'outbox',
          queue: 'my',
        });
      }),
    );

    registerRoute(
      '/document-qc/my/inProgress',
      ifHasAccess({ app }, () => {
        setPageTitle('Document QC');
        return app.getSequence('gotoWorkQueueSequence')({
          box: 'inProgress',
          queue: 'my',
        });
      }),
    );

    registerRoute(
      '/document-qc/section',
      ifHasAccess({ app }, () => {
        setPageTitle('Document QC');
        return app.getSequence('gotoWorkQueueSequence')({
          box: null,
          queue: 'section',
        });
      }),
    );

    registerRoute(
      '/document-qc/section/inbox',
      ifHasAccess({ app }, () => {
        setPageTitle('Document QC');
        return app.getSequence('gotoWorkQueueSequence')({
          box: 'inbox',
          queue: 'section',
        });
      }),
    );

    registerRoute(
      '/document-qc/section/inProgress',
      ifHasAccess({ app }, () => {
        setPageTitle('Document QC');
        return app.getSequence('gotoWorkQueueSequence')({
          box: 'inProgress',
          queue: 'section',
        });
      }),
    );

    registerRoute(
      '/document-qc/section/outbox',
      ifHasAccess({ app }, () => {
        setPageTitle('Document QC');
        return app.getSequence('gotoWorkQueueSequence')({
          box: 'outbox',
          queue: 'section',
        });
      }),
    );

    registerRoute(
      '/practitioner-detail/*',
      ifHasAccess({ app }, barNumber => {
        setPageTitle('Practitioner Detail');
        return app.getSequence('gotoPractitionerDetailSequence')({
          barNumber,
        });
      }),
    );

    registerRoute(
      '/print-paper-service/*',
      ifHasAccess({ app }, docketNumber => {
        setPageTitle(`${getPageTitleDocketPrefix(docketNumber)} Print Service`);
        return app.getSequence('gotoPrintPaperServiceSequence')({
          docketNumber,
        });
      }),
    );

    registerRoute(
      '/trial-session-detail/*',
      ifHasAccess(
        { app, permissionToCheck: ROLE_PERMISSIONS.TRIAL_SESSIONS },
        trialSessionId => {
          setPageTitle('Trial session information');
          return app.getSequence('gotoTrialSessionDetailSequence')({
            trialSessionId,
          });
        },
      ),
    );

    registerRoute(
      '/trial-session-working-copy/*',
      ifHasAccess(
        { app, permissionToCheck: ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY },
        trialSessionId => {
          setPageTitle('Trial session working copy');
          return app.getSequence('gotoTrialSessionWorkingCopySequence')({
            trialSessionId,
          });
        },
      ),
    );

    registerRoute(
      '/trial-session-planning-report',
      ifHasAccess({ app }, () => {
        setPageTitle('Trial session planning report');
        return app.getSequence('gotoTrialSessionPlanningReportSequence')();
      }),
    );

    registerRoute(
      '/trial-sessions..',
      ifHasAccess(
        { app, permissionToCheck: ROLE_PERMISSIONS.TRIAL_SESSIONS },
        () => {
          const trialSessionFilter = {};
          forEach(route.query(), (value, key) => {
            set(trialSessionFilter, key, value);
          });
          setPageTitle('Trial sessions');
          return app.getSequence('gotoTrialSessionsSequence')({
            query: trialSessionFilter,
          });
        },
      ),
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
      ifHasAccess({ app }, () => {
        setPageTitle('Before you file a petition');
        app.getSequence('gotoBeforeStartCaseSequence')();
      }),
    );

    registerRoute(
      '/file-a-petition/step-*',
      ifHasAccess({ app }, step => {
        setPageTitle('File a petition');
        if (app.getState('currentPage') === 'StartCaseWizard') {
          return app.getSequence('chooseStartCaseWizardStepSequence')({
            step: `${step}`,
            wizardStep: `StartCaseStep${step}`,
          });
        } else {
          if (app.getState('currentPage') !== 'StartCaseInternal') {
            switch (step) {
              case '1':
                return app.getSequence('gotoStartCaseWizardSequence')({
                  step: `${step}`,
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
      ifHasAccess({ app }, () => {
        setPageTitle('Petition Filed Successfully');
        return app.getSequence('gotoFilePetitionSuccessSequence')();
      }),
    );

    registerRoute(
      '/file-a-petition-pa11y/step-*',
      ifHasAccess({ app }, step => {
        setPageTitle('File a petition');
        return app.getSequence('gotoStartCaseWizardSequence')({
          step,
          wizardStep: `StartCaseStep${step}`,
        });
      }),
    );

    registerRoute(
      '/add-a-trial-session',
      ifHasAccess(
        { app, permissionToCheck: ROLE_PERMISSIONS.TRIAL_SESSIONS },
        () => {
          setPageTitle('Add a trial session');
          return app.getSequence('gotoAddTrialSessionSequence')();
        },
      ),
    );

    registerRoute(
      '/edit-trial-session/*',
      ifHasAccess(
        { app, permissionToCheck: ROLE_PERMISSIONS.TRIAL_SESSIONS },
        trialSessionId => {
          setPageTitle('Edit trial session');
          return app.getSequence('gotoEditTrialSessionSequence')({
            trialSessionId,
          });
        },
      ),
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
      '/messages/*/*',
      ifHasAccess({ app }, (queue, box) => {
        setPageTitle('Messages');
        return app.getSequence('gotoMessagesSequence')({
          box,
          queue,
        });
      }),
    );

    registerRoute(
      '/messages/*/message-detail/*',
      ifHasAccess({ app }, (docketNumber, parentMessageId) => {
        setPageTitle('Message detail');
        return app.getSequence('gotoMessageDetailSequence')({
          docketNumber,
          parentMessageId,
        });
      }),
    );

    registerRoute(
      '/messages/*/message-detail/*?..',
      ifHasAccess({ app }, (docketNumber, parentMessageId) => {
        const { documentId } = route.query();
        setPageTitle('Message detail');
        return app.getSequence('gotoMessageDetailSequence')({
          docketNumber,
          documentId,
          parentMessageId,
        });
      }),
    );

    registerRoute(
      '/pdf-preview',
      ifHasAccess({ app }, () => {
        setPageTitle('PDF Preview');
        return app.getSequence('gotoPdfPreviewSequence')();
      }),
    );

    registerRoute(
      '/reports/case-inventory-report',
      ifHasAccess({ app }, () => {
        setPageTitle('Case Inventory Report');
        return app.getSequence('gotoCaseInventoryReportSequence')();
      }),
    );

    registerRoute(
      '/reports/case-deadlines',
      ifHasAccess({ app }, () => {
        setPageTitle('Case deadlines');
        return app.getSequence('gotoCaseDeadlineReportSequence')();
      }),
    );

    registerRoute(
      '/reports/blocked-cases',
      ifHasAccess({ app }, () => {
        setPageTitle('Blocked cases');
        return app.getSequence('gotoBlockedCasesReportSequence')();
      }),
    );

    registerRoute(
      '/reports/pending-report',
      ifHasAccess({ app }, () => {
        setPageTitle('Pending report');
        return app.getSequence('gotoPendingReportSequence')();
      }),
    );

    registerRoute(
      '/reports/pending-report/printable..',
      ifHasAccess({ app }, () => {
        const { judgeFilter } = route.query();
        setPageTitle('Pending report');
        return app.getSequence('gotoPrintablePendingReportSequence')({
          judgeFilter: decodeURIComponent(judgeFilter),
        });
      }),
    );

    registerRoute(
      '/user/contact/edit',
      ifHasAccess({ app }, () => {
        setPageTitle('Edit user contact');
        return app.getSequence('gotoUserContactEditSequence')();
      }),
    );

    registerRoute(
      '/search/no-matches',
      ifHasAccess(
        { app, permissionToCheck: ROLE_PERMISSIONS.ADVANCED_SEARCH },
        () => {
          setPageTitle('Search results');
          return app.getSequence('gotoCaseSearchNoMatchesSequence')();
        },
      ),
    );

    registerRoute(
      '/search..',
      ifHasAccess(
        { app, permissionToCheck: ROLE_PERMISSIONS.ADVANCED_SEARCH },
        () => {
          const query = route.query();
          setPageTitle('Advanced search');
          return app.getSequence('gotoAdvancedSearchSequence')(query);
        },
      ),
    );

    registerRoute('/mock-login...', () => {
      const { path, token } = queryStringDecoder();
      if (token) {
        setPageTitle('Mock login');
        return app.getSequence('submitLoginSequence')({
          path,
          token: `${token}@example.com`,
        });
      }

      if (process.env.COGNITO) {
        setPageTitle('Dashboard');
        return app.getSequence('gotoDashboardSequence')();
      } else {
        setPageTitle('Mock login');
        return app.getSequence('gotoLoginSequence')();
      }
    });

    registerRoute('/privacy', () => {
      setPageTitle('Privacy');
      return app.getSequence('gotoPrivacySequence')();
    });

    registerRoute('/contact', () => {
      setPageTitle('Contact');
      return app.getSequence('gotoContactSequence')();
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

    route.start(true); // immediately triggers BASE_ROUTE
  },
};

export {
  back,
  createObjectURL,
  externalRoute,
  ifHasAccess,
  openInNewTab,
  revokeObjectURL,
  route,
  router,
};
