import { attachSamplePdfFile } from '../../../../../../helpers/file/upload-file';
import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';

describe('Private practitioner files document on case they are already associated with', () => {
  describe('Upload File on already associated case', () => {
    it('should allow private practitioner to select filing party and file document on a case they are already associated with', () => {
      const primaryFilerName = 'John';

      loginAsPetitioner();
      petitionerCreatesElectronicCase(primaryFilerName).then(docketNumber => {
        petitionsClerkServesPetition(docketNumber);
        loginAsPrivatePractitioner();
        externalUserSearchesDocketNumber(docketNumber);

        cy.get('[data-testid="request-represent-a-party-button"]').click();
        selectTypeaheadInput('document-type', 'Entry of Appearance');
        cy.get('[data-testid="filer-John, Petitioner"]').click();
        cy.get('[data-testid="request-access-submit-document"]').click();
        cy.get('[data-testid="submit-represent-a-party-button"]').click();
        cy.get('[data-testid="button-file-document"]').click();
        cy.get('[data-testid="ready-to-file"]').click();
        selectTypeaheadInput('document-type', 'Motion for a New Trial');
        cy.get('[data-testid="submit-document"]').click();
        attachSamplePdfFile('primary-document');
        cy.get('[data-testid="primaryDocument-objections-No"]').click();
        cy.get('[data-testid="filingParty-John, Petitioner"]').click();
        cy.get('[data-testid="file-document-submit-document"]').click();
        cy.get('[data-testid="filingParty-John, Petitioner"]').should(
          'have.text',
          'John, Petitioner',
        );
        cy.get('[data-testid="redaction-acknowledgement-label"]').click();
        cy.get('[data-testid="file-document-review-submit-document"]').click();
        cy.get('[data-testid="success-alert"]').should('be.visible');
      });
    });
  });
});
