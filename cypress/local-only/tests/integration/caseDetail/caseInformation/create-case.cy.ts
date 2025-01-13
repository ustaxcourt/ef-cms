import { createAndServePaperPetition } from '../../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import {
  getCaseDetailTab,
  navigateTo as navigateToCaseDetail,
} from '../../../../support/pages/case-detail';

import {
  loginAsCaseServicesSupervisor,
  loginAsIrsPractitioner,
} from '../../../../../helpers/authentication/login-as-helpers';

import { createTrialSession } from '../../../../../helpers/trialSession/create-trial-session';

import { CASE_STATUS_TYPES } from '../../../../../../shared/src/business/entities/EntityConstants';
import { attachFile } from '../../../../../helpers/file/upload-file';
import { goToCase } from '../../../../../helpers/caseDetail/go-to-case';
import { selectTypeaheadInput } from '../../../../../helpers/components/typeAhead/select-typeahead-input';
import { updateCaseStatus } from '../../../../../helpers/caseDetail/caseInformation/update-case-status';

describe('Submit case to the IRS', () => {
  it('should display the docket record correctly when uploading an attachment to petition', () => {
    // TODO 10419: Create multiple cases
    createAndServePaperPetition({ yearReceived: '2025' })
      .then(({ docketNumber }) => {
        console.log('Docket Number: ' + docketNumber);

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
        cy.get('label#primary-document-label').should(
          'have.class',
          'validated',
        );
        cy.get('button#submit-document').click();
        cy.get('label#redaction-acknowledgement-label').click();
        cy.get('button#submit-document').click();
        cy.showsSuccessMessage(true);
        loginAsCaseServicesSupervisor();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
      })
      .then(something => {
        console.log('Something: ' + something);
      });

    // TODO 10419: Add TrialSession
  });
});
