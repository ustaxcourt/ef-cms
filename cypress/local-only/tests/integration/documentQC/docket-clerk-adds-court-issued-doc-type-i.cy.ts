import { attachFile } from '../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../helpers/authentication/logout';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

/**
 * Type I court-issued documents (e.g. Notice of Assignment of Trial Judge)
 * require a judge to be selected and have no description field, per
 * `addCourtIssuedDocketEntryNonstandardHelper`'s `Type I` case.
 */
describe('Docket Clerk adds a Type I Court Issued document', () => {
  it('requires a judge to be selected and files a Notice of Assignment of Trial Judge', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      logout();

      loginAsDocketClerk();
      cy.visit(`/case-detail/${docketNumber}/upload-court-issued`);
      cy.get('[data-testid="upload-description"]').type(
        'Notice of Assignment of Trial Judge',
      );
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document-file"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('[data-testid="save-uploaded-pdf-button"]').click();
      cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();

      selectTypeaheadInput(
        'court-issued-document-type-search',
        'Notice of Assignment of Trial Judge',
      );
      cy.get('[data-testid="judge-select"]').should('exist');
      cy.get('[data-testid="document-description-input"]').should('not.exist');

      cy.get('[data-testid="serve-to-parties-btn"]').click();
      cy.contains('.usa-error-message', 'Select a judge').should('exist');

      cy.get('[data-testid="judge-select"]').select('Colvin');
      cy.contains('.usa-error-message', 'Select a judge').should('not.exist');
      cy.get('[data-testid="docket-entry-preview-text"]').should(
        'contain.text',
        'Notice of Assignment of Trial Judge to Judge Colvin',
      );

      cy.get('[data-testid="serve-to-parties-btn"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.url().should('not.contain', '/add-court-issued-docket-entry');

      goToCase(docketNumber);
      cy.get('[data-testid="document-viewer-link-NATJ"]').should(
        'have.text',
        'Notice of Assignment of Trial Judge to Judge Colvin',
      );
    });
  });
});
