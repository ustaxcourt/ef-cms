import { loginAsPetitionsClerk } from '../../helpers/auth/login-as-helpers';
import { petitionerCreatesEletronicCaseForSelfAndDeceasedSpouse } from '../../helpers/petitioner-creates-electronic-case-for-self-and-deceased-spouse.cy';

describe('Petitions clerk QCs a case with petitioner and deceased spouse', () => {
  it('should keep all case information after QC completion', () => {
    // working title
    petitionerCreatesEletronicCaseForSelfAndDeceasedSpouse().then(
      docketNumber => {
        loginAsPetitionsClerk();

        describe('petitions clerk QCs case', () => {
          cy.get('[data-testid="docket-number-search-input"]').type(
            docketNumber,
          );
          cy.get('[data-testid="search-docket-number"]').click();
          cy.get('[data-testid="document-viewer-link-P"]').click();
          cy.get('[data-testid="review-and-serve-petition"]').click();

          cy.get('[data-testid="contact-primary-name"]').should(
            'have.value',
            'John Freeman',
          );

          cy.get('[data-testid="contact-secondary-care-of-name"]').should(
            'have.value',
            'John Freeman',
          );

          cy.get('[data-testid="tab-irs-notice"]').click();
          cy.get('[data-testid="has-irs-verified-notice-no"]').click();
          cy.get('[data-testid="submit-case"]').click();
        });
      },
    );

    cy.get(
      ':nth-child(3) > address > div > .margin-top-0 > :nth-child(1)',
    ).should('have.text', 'Sally Deceased ');
    cy.get('.margin-top-0 > :nth-child(2)').should(
      'have.text',
      'c/o John Freeman',
    );
    cy.get(':nth-child(2) > address > div > .margin-top-0 > span').should(
      'have.text',
      'John Freeman ',
    );
    cy.get('[data-testid="serve-case-to-irs"]').click();
    cy.get('[data-testid="modal-confirm"]').click();
    cy.get('[data-testid="tab-case-information"] > .button-text').click();
    cy.get('[data-testid="tab-parties"] > .button-text').click();
    cy.get(
      '[data-testid="petitioner-card-Sally Deceased"] > .card > .content-wrapper > .text-wrap',
    ).should('have.text', 'Sally Deceased');
    cy.get(
      '[data-testid="petitioner-card-Sally Deceased"] > .card > .content-wrapper > :nth-child(3) > .margin-top-0',
    ).should('have.text', ' c/o John Freeman');
  });
});
