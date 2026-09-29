import { attachFile } from '../../../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { goToCase } from '../../../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk,
  loginAsIrsPractitioner,
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkAddsRespondentToCase } from '../../../../../../helpers/caseDetail/caseInformation/petitionsclerk-adds-respondent-to-case';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';
import { checkA11y } from '../../../../../support/generalCommands/checkA11y';

describe('Private practitioner files a Motion to Withdraw as Counsel (M112)', () => {
  const primaryFilerName = 'John';
  const practitionerName = 'Test Private Practitioner';
  const irsPractitionerName = 'Test IRS Practitioner';
  const irsPractitionerBarNumber = 'RT6789';
  const petitionerFilingParty = `filingParty-${primaryFilerName}, Petitioner`;
  const respondentFilingParty = 'party-irs-practitioner-label';

  const createCaseRepresentedByPractitioner = (): Cypress.Chainable<string> => {
    loginAsPetitioner();
    return externalUserCreatesElectronicCase(primaryFilerName).then(
      docketNumber => {
        petitionsClerkServesPetition(docketNumber);

        loginAsPrivatePractitioner();
        externalUserSearchesDocketNumber(docketNumber);
        cy.get('[data-testid="request-represent-a-party-button"]').click();
        selectTypeaheadInput(
          'case-association-document-type-search',
          'Entry of Appearance',
        );
        cy.get(`[data-testid="filer-${primaryFilerName}, Petitioner"]`).click();
        cy.get('[data-testid="request-access-submit-document"]').click();
        cy.get('[data-testid="submit-represent-a-party-button"]').click();
        cy.get('[data-testid="button-file-document"]').should('exist');

        return cy.wrap(docketNumber);
      },
    );
  };

  const createCaseRepresentedByIrsPractitioner =
    (): Cypress.Chainable<string> => {
      loginAsPetitioner();
      return externalUserCreatesElectronicCase(primaryFilerName).then(
        docketNumber => {
          petitionsClerkServesPetition(docketNumber);
          petitionsClerkAddsRespondentToCase(
            docketNumber,
            irsPractitionerBarNumber,
          );

          loginAsIrsPractitioner();
          goToCase(docketNumber);
          cy.get('[data-testid="button-file-document"]').should('exist');

          return cy.wrap(docketNumber);
        },
      );
    };

  const attachSupportingExhibit = (
    prefix: 'supporting' | 'secondary',
  ): void => {
    const isSecondary = prefix === 'secondary';
    const selectId = isSecondary
      ? '#secondary-supporting-document-0'
      : '#supporting-document-0';
    const fileTestId = isSecondary
      ? 'secondary-supporting-document-file-0'
      : 'supporting-document-file-0';

    cy.get(
      isSecondary
        ? '#add-secondary-supporting-document-button'
        : '#add-supporting-document-button',
    ).click();
    cy.get(selectId).select('Exhibit');
    attachFile({
      filePath: '../../helpers/file/sample.pdf',
      selector: `[data-testid="${fileTestId}"]`,
      selectorToAwaitOnSuccess: `[data-testid="upload-file-success-${fileTestId}"]`,
    });
  };

  const submitFiling = (filingPartyTestId: string): void => {
    cy.get(`[data-testid="${filingPartyTestId}"]`).click();
    cy.get('[data-testid="file-document-submit-document"]').click();
    cy.contains('h1', 'Review Your Filing').should('exist');
    cy.get('[data-testid="redaction-acknowledgement-label"]').click();
    cy.get('[data-testid="file-document-review-submit-document"]').click();
    cy.get('[data-testid="loading-overlay"]').should('not.exist');
    cy.get('[data-testid="success-alert"]').should('contain', 'Print receipt.');
  };

  const fileMotionToWithdrawWithExhibit = (
    filingPartyTestId: string = petitionerFilingParty,
  ): void => {
    cy.get('[data-testid="button-file-document"]').click();
    cy.get('[data-testid="ready-to-file"]').click();
    selectTypeaheadInput(
      'complete-doc-document-type-search',
      'Motion to Withdraw as Counsel',
    );
    cy.get('[data-testid="submit-document"]').click();

    attachFile({
      filePath: '../../helpers/file/sample.pdf',
      selector: '[data-testid="primary-document"]',
      selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
    });
    cy.get('[data-testid="primaryDocument-objections-No"]').click();
    attachSupportingExhibit('supporting');

    submitFiling(filingPartyTestId);
  };

  const withdrawalRows = (): Cypress.Chainable<JQuery<HTMLElement>> =>
    cy
      .get('[data-testid="docket-record-table"] tr')
      .filter(':contains("Withdraw as Counsel")');

  it('should display the practitioner as filed by on the M112 and its supporting document', () => {
    createCaseRepresentedByPractitioner().then(() => {
      fileMotionToWithdrawWithExhibit();

      withdrawalRows()
        .should('have.length', 2)
        .each(row => {
          cy.wrap(row)
            .find('[data-testid="docket-entry-filedBy"]')
            .should('have.text', practitionerName);
        });

      checkA11y();
    });
  });

  it('should display the IRS practitioner as filed by on the M112 and its supporting document', () => {
    createCaseRepresentedByIrsPractitioner().then(() => {
      fileMotionToWithdrawWithExhibit(respondentFilingParty);

      withdrawalRows()
        .should('have.length', 2)
        .each(row => {
          cy.wrap(row)
            .find('[data-testid="docket-entry-filedBy"]')
            .should('have.text', irsPractitionerName);
        });
    });
  });

  it('should display the practitioner as filed by on every document when a Motion for Leave to File targets an M112', () => {
    createCaseRepresentedByPractitioner().then(() => {
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Motion for Leave to File',
      );
      selectTypeaheadInput(
        'secondary-doc-secondary-document-type',
        'Motion to Withdraw as Counsel',
      );
      cy.get('[data-testid="submit-document"]').click();

      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('[data-testid="primaryDocument-objections-No"]').click();
      attachSupportingExhibit('supporting');

      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="secondary-document"]',
        selectorToAwaitOnSuccess:
          '[data-testid="upload-file-success-secondary-document"]',
      });
      cy.get('[data-testid="secondaryDocument-objections-No"]').click();
      attachSupportingExhibit('secondary');

      submitFiling(petitionerFilingParty);

      withdrawalRows()
        .should('have.length', 4)
        .each(row => {
          cy.wrap(row)
            .find('[data-testid="docket-entry-filedBy"]')
            .should('have.text', practitionerName);
        });
    });
  });

  it('should allow the docket clerk to edit the filed by of an e-filed M112 during QC', () => {
    createCaseRepresentedByPractitioner().then(docketNumber => {
      fileMotionToWithdrawWithExhibit();

      loginAsDocketClerk();
      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
      cy.contains(
        `[data-testid=work-item-document-link-${docketNumber}]`,
        /^\s*Motion to Withdraw as Counsel/,
      ).click();

      cy.get('#filed-by').should('have.value', practitionerName);
      cy.get('#filed-by').type(' (QC edit)');
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="success-alert"]').should('contain', 'QC Completed');

      goToCase(docketNumber);
      cy.contains('[data-testid^="docket-entry-eventCode-"]', 'M112')
        .parents('tr')
        .find('[data-testid="docket-entry-filedBy"]')
        .should('have.text', `${practitionerName} (QC edit)`);
    });
  });
});
