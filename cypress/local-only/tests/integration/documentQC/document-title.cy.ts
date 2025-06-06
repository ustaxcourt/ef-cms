import { attachFile } from '../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import {
  loginAsDocketClerk,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';
import { viewMyOutbox } from 'cypress/local-only/support/pages/dashboard';

describe('Document title updates correctly', () => {
  const primaryFilerName = 'John';
  const additionalInfo = 'Test additional info from document-title.cy.ts';

  before(() => {
    loginAsPrivatePractitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      cy.wrap(docketNumber).as('docketNumber');
      petitionsClerkServesPetition(docketNumber);
    });
  });

  it('private practitioner files an exhibit', function () {
    loginAsPrivatePractitioner();
    cy.visit(`/case-detail/${this.docketNumber}`);
    cy.get('[data-testid="button-file-document"]').click();
    cy.get('[data-testid="ready-to-file"]').click();
    selectTypeaheadInput('complete-doc-document-type-search', 'Exhibit(s)');
    cy.get('[data-testid="submit-document"]').click();
    attachFile({
      filePath: '../../helpers/file/sample.pdf',
      selector: '[data-testid="primary-document"]',
      selectorToAwaitOnSuccess:
        '[data-testid="upload-file-success-primary-document"]',
    });
    cy.get(
      `[data-testid="filingParty-${primaryFilerName}, Petitioner"]`,
    ).click();
    cy.get('[data-testid="file-document-submit-document"]').click();
    cy.get('[data-testid="redaction-acknowledgement-label"]').click();
    cy.get('[data-testid="file-document-review-submit-document"]').click();
    cy.get('[data-testid="loading-overlay"]').should('not.exist');
  });

  it('docket clerk qcs and adds additional info to exhibit, then sees correct document title in outbox', function () {
    loginAsDocketClerk();
    cy.get('[data-testid="document-qc-nav-item"]').click();
    cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
    cy.contains('a', 'Exhibit(s)').last().click();
    cy.get('[data-testid="additional-info-primary-document-form"]').type(
      additionalInfo,
    );
    cy.get('[data-testid="add-to-coversheet-primary-document-form"]').click({
      force: true,
    });
    cy.get('[data-testid="save-and-finish-document-qc"]').click();

    // verify outbox shows correct title
    viewMyOutbox();
    cy.contains(`Exhibit(s) ${additionalInfo}`).should('exist');
  });

  it('private practitioner files an amendment to the exhibit', function () {
    loginAsPrivatePractitioner();
    cy.visit(`/case-detail/${this.docketNumber}`);
    cy.get('[data-testid="button-file-document"]').click();
    cy.get('[data-testid="ready-to-file"]').click();
    selectTypeaheadInput(
      'complete-doc-document-type-search',
      'Amendment [anything]',
    );
    // select the existing Exhibit as the “previous document” to the amendment
    cy.get('[data-testid="previous-document-search"]').select(
      `Exhibit(s) ${additionalInfo}`,
    );
    cy.get('[data-testid="ordinal-field-select-search"]').select('15');
    cy.get('[data-testid="submit-document"]').click();
    attachFile({
      filePath: '../../helpers/file/sample.pdf',
      selector: '[data-testid="primary-document"]',
      selectorToAwaitOnSuccess:
        '[data-testid="upload-file-success-primary-document"]',
    });
    cy.get(`[data-testid="filingParty-${primaryFilerName}, Petitioner"]`).click(
      { force: true },
    );
    cy.get('[data-testid="file-document-submit-document"]').click();
    cy.get('[data-testid="redaction-acknowledgement-label"]').click();
    cy.get('[data-testid="file-document-review-submit-document"]').click();
    cy.get('[data-testid="loading-overlay"]').should('not.exist');
  });

  it('docket clerk qcs amendment and sees the correct document title in the outbox', function () {
    loginAsDocketClerk();
    cy.get('[data-testid="document-qc-nav-item"]').click();
    cy.get('[data-testid="switch-to-section-document-qc-button"]').click();

    cy.contains('a', 'Amendment').last().click();
    cy.get('[data-testid="save-and-finish-document-qc"]').click();

    // verify outbox shows correct title
    viewMyOutbox();
    cy.contains(`Fifteenth Amendment to Exhibit(s) ${additionalInfo}`).should(
      'exist',
    );
  });
});
