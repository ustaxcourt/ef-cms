import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition: Intro', () => {
  describe('Petitioner', () => {
    describe('Welcome Page', () => {
      beforeEach(() => {
        loginAsPetitioner('petitioner7');
      });
      it('should display correct welcome message for petitioner', () => {
        cy.get('[data-testid="error-alert-title"]').should(
          'have.text',
          'Have you already filed a petition by mail or do you want electronic access to your existing case?',
        );
        cy.get('[data-testid="error-alert-message"]').contains(
          'Do not start a new case.',
        );
      });

      it('should display taxpayer tools and free taxpayer help sections', () => {
        cy.get('[data-testid="taxpayer-tools-section"]').should('exist');
        cy.get('[data-testid="free-taxpayer-help-section"]').should('exist');
      });

      it('should navigate to the before starting a case page', () => {
        cy.get('[data-testid="file-a-petition"]').click();
        cy.get('h2').should('have.text', 'How to Create a Case');
      });
    });

    describe('Before starting a case', () => {
      beforeEach(() => {
        loginAsPetitioner('petitioner');
        cy.get('[data-testid="file-a-petition"]').click();
      });
      it('should display correct text for start a case instructions', () => {
        cy.get('[data-testid="upload-irs-notice-title"]').contains(
          'If you received',
        );
        cy.get('[data-testid="upload-irs-notice-bullet-1"]').contains(
          'Submit a PDF of the Notice(s) you received',
        );
        cy.get('[data-testid="confirm-identity-bullet-1"]').contains(
          'This document is sent to the IRS to help them identify you',
        );
        cy.get('[data-testid="confirm-identity-bullet-1"]').contains(
          'This is the only document that should contain your SSN, TIN, or EIN.',
        );
        cy.get('[data-testid="deadline-to-file"]').contains(
          'If you received a notice in the mail from the IRS',
        );
        cy.get('[data-testid="are-you-filing-jointly-with-a-spouse"]').contains(
          'Are you filing jointly with a spouse?',
        );

        cy.get('[data-testid="are-you-filing-jointly-with-a-spouse"]')
          .eq(0)
          .click();
        cy.get('[data-testid="filing-jointly-accordion-item"]').contains(
          "To file a joint Petition with your spouse, you must have the spouse's consent",
        );
        cy.get('[data-testid="filing-jointly-accordion-item"]').contains(
          "If you do not have your spouse's consent",
        );
        cy.get('[data-testid="filing-jointly-accordion-item"]').contains(
          'select “Myself” as the person who is filing.',
        );
      });
    });
  });
  describe('Practitioner', () => {
    describe('Welcome Page', () => {
      beforeEach(() => {
        cy.login('privatePractitioner3');
      });
      it('should display correct welcome message text for practitioner', () => {
        cy.get('[data-testid="warning-alert-title"]').should(
          'have.text',
          'Do you need access to an existing case?',
        );
        cy.get('[data-testid="warning-alert-message"]').should(
          'have.text',
          'Search for the case docket number to file the appropriate document.',
        );
      });

      it('should not display taxpayer tools and free taxpayer help sections', () => {
        cy.get('[data-testid="taxpayer-tools-section"]').should('not.exist');
        cy.get('[data-testid="free-taxpayer-help-section"]').should(
          'not.exist',
        );
      });

      it('should navigate to the before starting a case page', () => {
        cy.get('[data-testid="file-a-petition"]').click();
        cy.get('h2').should('have.text', 'How to Create a Case');
      });
    });

    describe('Before starting a case', () => {
      beforeEach(() => {
        loginAsPrivatePractitioner();
        cy.get('[data-testid="file-a-petition"]').click();
      });
      it('should display correct text for start a case instructions', () => {
        cy.get('[data-testid="upload-irs-notice-title"]').contains(
          'If the petitioner received',
        );
        cy.get('[data-testid="upload-irs-notice-bullet-1"]').contains(
          'Submit a PDF of the Notice(s) they received',
        );
        cy.get('[data-testid="confirm-identity-bullet-1"]').contains(
          'This document is sent to the IRS to help them identify the petitioner',
        );
        cy.get('[data-testid="confirm-identity-bullet-1"]').contains(
          'This is the only document that should contain the petitioner’s SSN, TIN, or EIN.',
        );
        cy.get('[data-testid="deadline-to-file"]').contains(
          'If the petitioner received a notice in the mail from the IRS',
        );
        cy.get('[data-testid="are-you-filing-jointly-with-a-spouse"]').should(
          'not.exist',
        );
      });
    });
  });
});
