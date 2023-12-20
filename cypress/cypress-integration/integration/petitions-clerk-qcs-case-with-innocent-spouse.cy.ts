import {
  loginAsPetitioner,
  loginAsPetitionsClerk,
} from '../../helpers/auth/login-as-helpers';
import { petitionerCreatesEletronicCase } from '../../helpers/petitioner-creates-electronic-case';

describe('Petitions clerk QCs a case with innocent spouse', () => {
  it('should keep all case information after QC completion', () => {
    loginAsPetitioner();
    petitionerCreatesEletronicCase('deceased spouse').then(docketNumber => {
      loginAsPetitionsClerk();
      describe('petitions clerk QCs case', () => {
        cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
        cy.get('[data-testid="search-docket-number"]').click();
        cy.get('[data-testid="document-viewer-link-P"]').click();
        cy.get('[data-testid="review-and-serve-petition"]').click();

        cy.get('[data-testid="contact-primary-name"]').should(
          'have.value',
          'Sally Scumbag',
        );

        cy.get('[data-testid="tab-irs-notice"]').click();
        cy.get('[data-testid="has-irs-verified-notice-no"]').click();
        cy.get('[data-testid="submit-case"]').click();
      });
    });

    cy.get('.margin-top-0 > :nth-child(1)').should(
      'have.text',
      'Sally Scumbag ',
    );

    cy.get('.margin-top-0 > :nth-child(2)').should(
      'have.text',
      'c/o John Innocent Spouse',
    );
    cy.get(':nth-child(2) > address > div > .margin-top-0 > span').should(
      'have.text',
      'Sally Scumbag c/o John Innocent Spouse',
    );
    cy.get('[data-testid="serve-case-to-irs"]').click();
    cy.get('[data-testid="modal-confirm"]').click();
    cy.get('[data-testid="tab-case-information"] > .button-text').click();
    cy.get('[data-testid="tab-parties"] > .button-text').click();
    cy.get('.text-wrap').should('have.text', 'Sally Scumbag');
    cy.get('.content-wrapper > :nth-child(3) > .margin-top-0').should(
      'have.text',
      ' c/o John Innocent Spouse',
    );
    cy.get('[data-testid="address1-line"]').should(
      'have.text',
      '111 South West St.',
    );
    cy.get('[data-testid="contact-info-city-state"]').should(
      'have.text',
      'Orlando, AL 12345',
    );
    cy.get('[data-testid="contact-info-phone-number"]').should(
      'have.text',
      '111-111-1111',
    );
    cy.get('.content-wrapper > :nth-child(4)').should(
      'have.text',
      'petitioner1@example.com',
    );
  });
});
