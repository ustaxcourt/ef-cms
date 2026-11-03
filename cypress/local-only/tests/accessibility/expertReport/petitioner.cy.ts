import { attachSamplePdfFile } from '../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { externalUserSearchesDocketNumber } from '../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';
import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Expert Report - Petitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues on the docket record after filing an Expert Report', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      loginAsPetitioner();
      externalUserSearchesDocketNumber(docketNumber);

      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Expert Report',
      );
      cy.get('[data-testid="submit-document"]').click();
      attachSamplePdfFile('primary-document');
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="success-alert"]').should('be.visible');

      cy.contains('[data-testid^="docket-entry-eventCode-"]', 'RTP')
        .parents('tr')
        .find('[data-testid^="docket-entry-filingsAndProceedings-"]')
        .should('contain', 'Expert Report');

      checkA11y();
    });
  });
});
