import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';
import { loginAsPetitioner } from '../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkQcsAndServesElectronicCase } from '../../../helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';

describe('irs superuser integration', () => {
  //if local, skip this test
  if (getCypressEnv().env === 'local') return true;

  const password = getCypressEnv().defaultAccountPass;
  const userName = 'cypress_test_account_irs_super_user@example.com';

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
    cy.task('deleteAllIrsCypressTestAccounts');
  });

  after(() => {
    cy.task('deleteAllIrsCypressTestAccounts');
  });

  it('should let an irs superuser view the reconciliation report and download a STIN', () => {
    cy.task('createAccount', {
      irsEnv: true,
      password,
      role: ROLES.irsSuperuser,
      userName,
    });

    cy.task('getBearerToken', { isIrsEnv: true, password, userName }).then(
      idToken => {
        loginAsPetitioner();
        petitionerCreatesElectronicCase().then(docketNumber => {
          petitionsClerkQcsAndServesElectronicCase(docketNumber);
          verifyReconciliationReportAndStinUrl(idToken as string);
        });
      },
    );
  });
});

/**
 *
 * This function asserts that the IRS Reconciliation report is accessible and that it contains
 * at least one downloadable STIN record. Method fails test if either of these conditions is
 * not met.
 *
 * @param bearerToken bearer token for IRS superuser session (see tasks::getBearerToken)
 */
const verifyReconciliationReportAndStinUrl = (bearerToken: string) => {
  const url = `https://api-${Cypress.env('DEPLOYING_COLOR')}.${getCypressEnv().env}.ef-cms.ustaxcourt.gov/v2/reconciliation-report/today`;
  cy.request({
    auth: {
      bearer: bearerToken,
    },
    url,
  }).then(response => {
    expect(response.status).to.equal(200);

    const { docketEntries } = response.body;

    // get document-download-url for STIN from case
    const { docketEntryId, docketNumber } = docketEntries.find(
      entry => entry.eventCode === 'STIN',
    );

    const docDownloadUrl = `https://api-${Cypress.env('DEPLOYING_COLOR')}.${getCypressEnv().env}.ef-cms.ustaxcourt.gov/v2/cases/${docketNumber}/entries/${docketEntryId}/document-download-url`;
    // get the download link for the stin
    cy.request({
      auth: {
        bearer: bearerToken,
      },
      url: docDownloadUrl,
    }).then(docDownloadUrlResponse => {
      expect(docDownloadUrlResponse.status).to.equal(200);
    });
  });
};
