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
 * Type B court-issued documents (e.g. Standing Scheduling Order, Standing
 * Pretrial Order, Order that case is assigned) require a judge to be
 * selected in addition to the document type, per
 * `addCourtIssuedDocketEntryNonstandardHelper`'s `Type B` case.
 *
 * Standing Scheduling Order (event code SSO) is used here since it is
 * servable and requires no signature, keeping the save path simple.
 */
describe('Docket Clerk adds a Type B Court Issued document', () => {
  it('requires a judge to be selected and files a Standing Scheduling Order', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      logout();

      loginAsDocketClerk();
      cy.visit(`/case-detail/${docketNumber}/upload-court-issued`);
      cy.get('[data-testid="upload-description"]').type(
        'Standing Scheduling Order',
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
        'Standing Scheduling Order',
      );

      cy.get('[data-testid="serve-to-parties-btn"]').click();
      cy.contains('.usa-error-message', 'Select a judge').should('exist');

      cy.get('[data-testid="judge-select"]').select('Colvin');
      cy.contains('.usa-error-message', 'Select a judge').should('not.exist');

      cy.get('[data-testid="serve-to-parties-btn"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.url().should('not.contain', '/add-court-issued-docket-entry');

      goToCase(docketNumber);
      cy.get('[data-testid="document-viewer-link-SSO"]').should(
        'have.text',
        'Standing Scheduling Order',
      );
    });
  });
});
