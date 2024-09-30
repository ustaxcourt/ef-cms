import { attachFile } from '../../../../../../helpers/file/upload-file';
import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { loginAsPetitioner } from '../../../../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';

describe(
  'Petitioner files external document on case',
  { scrollBehavior: 'center' },
  () => {
    it('should create an electronic petition, serve the petition, and files an "Answer" on the petition', () => {
      loginAsPetitioner();
      petitionerCreatesElectronicCase().then(docketNumber => {
        petitionsClerkServesPetition(docketNumber);
        loginAsPetitioner();
        externalUserSearchesDocketNumber(docketNumber);
      });
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Motion for Leave to File',
      );
      selectTypeaheadInput('secondary-doc-secondary-document-type', 'Answer');
      cy.get('[data-testid="submit-document"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('[data-testid=primaryDocument-objections-No]').click();
      cy.get('#submit-document').click();
      cy.get('[data-testid=redaction-acknowledgement-label]').click();
      cy.get('#submit-document').click();
      cy.get('[data-testid="document-download-link-M115"]').should(
        'have.text',
        'Motion for Leave to File Answer (No Objection)',
      );
    });
  },
);
