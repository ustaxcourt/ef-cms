import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { goToCase } from '../../../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';

/**
 * Given a case
 * When a docket clerk adds a paper filing,
 * Then they can choose MLSP option
 */
describe('Private Practitioner requests to represent a party to a case', () => {
  it('should have access to auto generate entry of appearance if there are no parties with paper service preference', () => {
    const primaryFilerName = 'John';

    loginAsPetitioner();
    petitionerCreatesElectronicCase(primaryFilerName).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      loginAsDocketClerk1();
      goToCase(docketNumber);

      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-add-paper-filing"]').click();
      cy.get('[data-testid="primary-document-type-search"]').type(
        'MLSP{enter}',
      );

      cy.get(
        '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
      ).click();
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
      ).type('01/01/2018');

      cy.get('[data-testid="additional-info-1-textarea"]').type(
        'Test Secondary Additional Info',
      );

      cy.get('[data-testid="add-to-coversheet-checkbox"]').click();

      cy.get('[data-testid="filed-by-option"]').contains('Petitioner').click();

      cy.get('[data-testid="objections-No"').click();

      cy.get('[data-testid="upload-pdf-button"]').click();
      cy.get('input#primaryDocumentFile-file').attachFile(
        '../../helpers/file/sample.pdf',
      );

      cy.get('[data-testid="save-for-later"]').click();
      cy.get('[data-testid="success-alert"]').contains(
        'Your entry has been added to the docket record.',
      );

      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get(
        '[data-testid="individual-work-queue-in-progress-button"]',
      ).click();
      cy.get(
        `[data-testid="${docketNumber}-qc-item-row"] [data-testid="qc-link"]`,
      ).click();

      cy.get('[data-testid="primary-document-type-search"]').type(
        'MLSP{enter}',
      );

      cy.get('[data-testid="save-and-serve"]').click();

      cy.get('[data-testid="confirm-initiate-service-modal"]').contains(
        'Motion to Lift Stay of Proceedings',
      );
    });
  });
});

/**
 * Given a case
 * When a petitioner adds an electronic filing,
 * Then they can choose MLSP option
 */
describe('Petitioner files motion to lift stay of proceedings', () => {
  it('should show MLSP document type option and let us select it', () => {
    loginAsPetitioner();
    petitionerCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      loginAsPetitioner();
      externalUserSearchesDocketNumber(docketNumber);
    });
    cy.get('[data-testid="button-file-document"]').click();
    cy.get('[data-testid="ready-to-file"]').click();
    selectTypeaheadInput('document-type', 'MLSP');
    cy.get('[data-testid="submit-document"]').click();
    cy.get('[data-testid="primary-document"]').attachFile(
      '../../helpers/file/sample.pdf',
    );
    cy.get('[data-testid=primaryDocument-objections-No]').click();
    cy.get('#submit-document').click();
    cy.get('[data-testid=redaction-acknowledgement-label]').click();
    cy.get('#submit-document').click();
    cy.get('[data-testid="document-download-link-MLSP"]').should(
      'have.text',
      'Motion to Lift Stay of Proceedings (No Objection)',
    );
  });
});
