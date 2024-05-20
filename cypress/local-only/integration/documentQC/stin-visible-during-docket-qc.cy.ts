import { goToCase } from '../../../helpers/caseDetail/go-to-case';
import {
  loginAsCaseServicesSupervisor,
  loginAsPetitioner,
} from '../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../../helpers/fileAPetition/petitioner-creates-electronic-case';

/**
 * Given a case
 * When a docket clerk QCs a paper filing, changing the event code
 * Then they should see the document title was updated
 */
describe('Docket clerk QC-ing a paper filing', () => {
  it('should see the document title was updated when they change the event code while QC-ing', () => {
    loginAsPetitioner();
    petitionerCreatesElectronicCase().then(docketNumber => {
      loginAsCaseServicesSupervisor();
      goToCase(docketNumber);

      cy.get('[data-testid="document-viewer-link-P"]').click();
      cy.get('[data-testid="review-and-serve-petition"]').click();
      cy.get(
        '[data-testid="Statement of Taxpayer Identification"] > .button-text',
      ).click();
      cy.get(
        '[data-testid="Statement of Taxpayer Identification"] > .svg-inline--fa > path',
      ).should('be.visible');
      cy.get('.pdf-preview-viewer').should('be.visible');
      cy.get('[data-testid="submit-case"]').click();
      cy.get('[data-testid="tab-irs-notice"] > .button-text').click();
      cy.get('[data-testid="has-irs-verified-notice-no"]').click();
      cy.get('[data-testid="submit-case"]').click();
      cy.get('[data-testid="stinFileDisplay"] > .grid-row > .grid-col').should(
        'have.text',
        'Statement of Taxpayer Identification',
      );
    });
  });
});
