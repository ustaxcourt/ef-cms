import { createAndServePaperPetition } from '../../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import {
  getCaseDetailTab,
  navigateTo as navigateToCaseDetail,
} from '../../../../support/pages/case-detail';

import { loginAsIrsPractitioner } from '../../../../../helpers/authentication/login-as-helpers';

import { attachFile } from '../../../../../helpers/file/upload-file';
import { selectTypeaheadInput } from '../../../../../helpers/components/typeAhead/select-typeahead-input';

describe('Submit case to the IRS', () => {
  it('should display the docket record correctly when uploading an attachment to petition', () => {
    // TODO 10419: Create multiple cases
    createAndServePaperPetition().then(({ docketNumber }) => {
      console.log(docketNumber);

      loginAsIrsPractitioner();
      navigateToCaseDetail('irspractitioner', docketNumber);
      getCaseDetailTab('case-information').click();

      cy.get('[data-testid="button-first-irs-document"]').click();
      selectTypeaheadInput('complete-doc-document-type-search', 'Answer');
      cy.get('button#submit-document').click();

      cy.get('label#primary-document-label').scrollIntoView();
      cy.get('label#primary-document-label').should(
        'not.have.class',
        'validated',
      );
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '#primary-document',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('label#primary-document-label').should('have.class', 'validated');
      cy.get('button#submit-document').click();
      cy.get('label#redaction-acknowledgement-label').click();
      cy.get('button#submit-document').click();
      cy.showsSuccessMessage(true);
    });

    // TODO 10419: Add TrialSession
  });
});
