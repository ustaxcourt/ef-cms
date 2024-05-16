import { loginAsPetitioner } from '../../../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { uploadFile } from '../../../../../helpers/file/upload-file';

describe('IRS Practitioner files Entry of Appearance as First IRS Document', () => {
  describe('Auto Generate Entry of Appearance', () => {
    it('should allow auto-generation and subsequent filing of the Entry of Appearance', () => {
      const primaryFilerName = 'John';

      loginAsPetitioner();
      petitionerCreatesElectronicCase(primaryFilerName).then(docketNumber => {
        petitionsClerkServesPetition(docketNumber);

        cy.login('irspractitioner', `/case-detail/${docketNumber}`);
        cy.get('#button-first-irs-document').click();

        cy.get('#react-select-2-input').clear();
        cy.get('#react-select-2-input').type('e');
        cy.get('#react-select-2-option-0').click();
        cy.get('[data-testid="submit-document"]').click();

        cy.get('[data-testid="auto-generation"]').should('exist');
        cy.get('[data-testid="auto-generation"]').click();
        cy.get('#submit-document').click();

        cy.get('[data-testid="entry-of-appearance-pdf-preview"]').should(
          'exist',
        );
        cy.get('[data-testid="request-access-review-submit-document"]').click();

        cy.get('[data-testid="document-download-link-EA"]').should(
          'contain.text',
          'Entry of Appearance for Respondent',
        );
      });
    });
  });

  describe('Upload File Entry of Appearance', () => {
    it('should allow manual uploadand subsequent filing of Entry of Appearance', () => {
      const primaryFilerName = 'John';

      loginAsPetitioner();
      petitionerCreatesElectronicCase(primaryFilerName).then(docketNumber => {
        petitionsClerkServesPetition(docketNumber);
        cy.login('irspractitioner', `/case-detail/${docketNumber}`);
        cy.get('#button-first-irs-document').click();
        cy.get('#react-select-2-input').clear();
        cy.get('#react-select-2-input').type('e');
        cy.get('#react-select-2-option-0').click();
        cy.get('[data-testid="submit-document"]').click();

        cy.get('[data-testid="manual-generation-label"]').click();
        uploadFile('primary-document');
        cy.get('#submit-document').click();

        cy.get('[data-testid="redaction-acknowledgement-label"]').click();
        cy.get('[data-testid="file-document-review-submit-document"]').click();

        cy.get('[data-testid="document-download-link-EA"]').should(
          'have.text',
          'Entry of Appearance for Respondent',
        );
      });
    });
  });
});
