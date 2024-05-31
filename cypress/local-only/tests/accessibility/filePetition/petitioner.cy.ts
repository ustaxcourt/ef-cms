import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('File a Petition Page - Petitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('Step 1', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/step-1');
      cy.get('[data-testid="complete-step-1"]').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });
  });

  describe('Step 2', () => {
    it('should be free of a11y issues for irs notice', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition-pa11y/step-2');
      cy.get('[data-testid="complete-step-2"]').should('exist');
      cy.get('label#hasIrsNotice-0').click();
      cy.get('label#atp-file-upload-label').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues without irs notice', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition-pa11y/step-2');
      cy.get('[data-testid="complete-step-2"]').should('exist');
      cy.get('label#hasIrsNotice-1').click();
      cy.get('.case-type-select').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });
  });

  describe('Step 3', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition-pa11y/step-3');
      cy.get('[data-testid="complete-step-3"]').should('exist');
      cy.get('label#filing-type-0').click();
      cy.get('.contact-group').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    // TODO aria modal issues
    it('should be free of a11y issues when filing with spouse', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition-pa11y/step-3');
      cy.get('[data-testid="complete-step-3"]').should('exist');
      cy.get('label#filing-type-1').click();
      cy.get('label#is-spouse-deceased-1').click();
      cy.get('.modal-dialog').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues when filing with deceased spouse', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition-pa11y/step-3');
      cy.get('[data-testid="complete-step-3"]').should('exist');
      cy.get('label#filing-type-1').click();
      cy.get('label#is-spouse-deceased-0').click();
      cy.get('.contact-group').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues when filing with deceased spouse with international address', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition-pa11y/step-3');
      cy.get('[data-testid="complete-step-3"]').should('exist');
      cy.get('label#filing-type-1').click();
      cy.get('label#is-spouse-deceased-0').click();
      cy.get('#contactSecondary-country-radio-label-international').click();
      cy.get('.contactSecondary-country').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues when filing as corporation', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition-pa11y/step-3');
      cy.get('[data-testid="complete-step-3"]').should('exist');
      cy.get('label#filing-type-2').click();
      cy.get('label#is-business-type-0').click();
      cy.get('.contact-group').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues when filing for partnership as tax matters', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition-pa11y/step-3');
      cy.get('[data-testid="complete-step-3"]').should('exist');
      cy.get('label#filing-type-2').click();
      cy.get('label#is-business-type-1').click();
      cy.get('.contact-group').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues when filing for partnership as other than tax matters', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition-pa11y/step-3');
      cy.get('[data-testid="complete-step-3"]').should('exist');
      cy.get('label#filing-type-2').click();
      cy.get('label#is-business-type-2').click();
      cy.get('.contact-group').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues when filing for partnership as BBA', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition-pa11y/step-3');
      cy.get('[data-testid="complete-step-3"]').should('exist');
      cy.get('label#filing-type-2').click();
      cy.get('label#is-business-type-3').click();
      cy.get('.contact-group').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues when filing for estate with executor', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition-pa11y/step-3');
      cy.get('[data-testid="complete-step-3"]').should('exist');
      cy.get('label#filing-type-3').click();
      cy.get('#is-other-type-0').click();
      cy.get('#is-estate-type-0').click();
      cy.get('.contact-group').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues when filing for estate without executor', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition-pa11y/step-3');
      cy.get('[data-testid="complete-step-3"]').should('exist');
      cy.get('label#filing-type-3').click();
      cy.get('#is-other-type-0').click();
      cy.get('#is-estate-type-1').click();
      cy.get('.contact-group').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues when filing for estate as trust', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition-pa11y/step-3');
      cy.get('[data-testid="complete-step-3"]').should('exist');
      cy.get('label#filing-type-3').click();
      cy.get('#is-other-type-0').click();
      cy.get('#is-estate-type-2').click();
      cy.get('.contact-group').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });
  });

  describe('Step 4', () => {});
});
