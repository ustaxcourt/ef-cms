import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsCaseServicesSupervisor,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';

describe('Case services supervisor performing petition QC', () => {
  it('should show STIN during petition QC', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
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
