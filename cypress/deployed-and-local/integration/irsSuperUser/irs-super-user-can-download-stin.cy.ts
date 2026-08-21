import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { externalUserCreatesElectronicCase } from '../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';
import { loginAsPetitioner } from '../../../helpers/authentication/login-as-helpers';
import { petitionsClerkQcsAndServesElectronicCase } from '../../../helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';
import { v4 } from 'uuid';

describe('irs superuser integration', () => {
  const password = getCypressEnv().defaultAccountPass;
  const userName = `cypress_test_account_${v4().substring(0, 8)}@example.com`; // we substring because there is a 64 joi character limit on emails

  beforeEach(function () {
    if (getCypressEnv().isLocal) {
      this.skip();
    }
    Cypress.session.clearCurrentSessionData();
  });

  it('should let an irs superuser view the reconciliation report and download a STIN', () => {
    cy.task('createAccount', {
      isIrsEnv: true,
      name: 'irsSuperUser CI/CD',
      password,
      role: ROLES.irsSuperuser,
      userId: v4(),
      userName,
    });

    cy.task('getIrsBearerToken', { password, userName }).then(idToken => {
      loginAsPetitioner();
      externalUserCreatesElectronicCase().then(docketNumber => {
        petitionsClerkQcsAndServesElectronicCase(docketNumber);
        verifyReconciliationReportAndStinUrl(idToken as string);
      });
    });
  });
});

/**
 *
 * This function asserts that the IRS Reconciliation report is accessible and that it contains
 * at least one downloadable STIN record. Method fails test if either of these conditions is
 * not met.
 *
 * @param bearerToken bearer token for IRS superuser session (see tasks::getIrsBearerToken)
 */
const verifyReconciliationReportAndStinUrl = (bearerToken: string) => {
  const url = `https://api-${getCypressEnv().deployingColor}.${getCypressEnv().efcmsDomain}/v2/reconciliation-report/today`;
  const headers = {
    'x-test-user': 'true',
  };
  cy.request({
    auth: {
      bearer: bearerToken,
    },
    headers,
    url,
  }).then(response => {
    expect(response.status).to.equal(200);

    const { docketEntries } = response.body;

    // get document-download-url for STIN from case
    const { docketEntryId, docketNumber } = docketEntries.find(
      entry => entry.eventCode === 'STIN',
    );

    const docDownloadUrl = `https://api-${getCypressEnv().deployingColor}.${getCypressEnv().efcmsDomain}/v2/cases/${docketNumber}/entries/${docketEntryId}/document-download-url`;
    // get the download link for the stin
    cy.request({
      auth: {
        bearer: bearerToken,
      },
      headers,
      url: docDownloadUrl,
    }).then(docDownloadUrlResponse => {
      expect(docDownloadUrlResponse.status).to.equal(200);
    });
  });
};
