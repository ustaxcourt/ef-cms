import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { assertExists, retry } from '../../../../../../helpers/retry';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';
import { attachSamplePdfFile } from '../../../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import {
  loginAsIrsPractitioner,
  loginAsPetitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';

describe('Filing an Answer', function () {
  it('allows an IRS practitioner to file an Answer as the first IRS document on a fresh served case', () => {
    loginAsPetitioner();

    externalUserCreatesElectronicCase('Answer Test Petitioner').then(
      docketNumber => {
        petitionsClerkServesPetition(docketNumber);

        loginAsIrsPractitioner();
        externalUserSearchesDocketNumber(docketNumber);

        cy.get('[data-testid="button-first-irs-document"]').click();

        selectTypeaheadInput('complete-doc-document-type-search', 'Answer');
        cy.get('[data-testid="submit-document"]').click();

        cy.get('[data-testid="primary-document-label"]').scrollIntoView();
        attachSamplePdfFile('primary-document');

        cy.get('[data-testid="file-document-submit-document"]').click();

        cy.get('[data-testid="redaction-acknowledgement-label"]').click();
        cy.get('[data-testid="file-document-review-submit-document"]').click();
        cy.showsSuccessMessage(true);

        cy.get('[data-testid="docket-record-table"]').should('exist');
        cy.get('[data-testid="document-download-link-A"]').should(
          'contain.text',
          'Answer',
        );

        loginAsIrsPractitioner();
        cy.get('[data-testid="case-list-table"]').should('exist');
        retry(() => {
          return assertExists(
            `[data-testid="case-list-table"] a[href*="${docketNumber}"]`,
          );
        });
        cy.contains('[data-testid="case-list-table"] a', docketNumber).should(
          'exist',
        );
      },
    );
  });
});
