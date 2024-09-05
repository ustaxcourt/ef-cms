import { attachFile } from '../../../../helpers/file/upload-file';
import { fillPetitionerInformation } from './petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition', () => {
  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
    fillPetitionerInformation();
  });

  describe('Step 2 - Petition', () => {
    beforeEach(() => {
      cy.get('[data-testid="step-indicator-current-step-2-icon"]');
    });

    describe('Auto generate Petition', () => {
      describe('VALIDATION MESSAGES', () => {
        it('should display error messages when user presses "Next" button without filling reason and fact', () => {
          cy.get('[data-testid="step-2-next-button"]').click();

          cy.get('[data-testid="error_message_petitionReasons[0]"]').should(
            'exist',
          );

          cy.get('[data-testid="error_message_petitionFacts[0]"]').should(
            'exist',
          );
        });

        it('should remove any error message when the user starts typing/changing the input', () => {
          cy.get('[data-testid="step-2-next-button"]').click();

          cy.get('[data-testid="error_message_petitionReasons[0]"]').should(
            'exist',
          );

          cy.get('[data-testid="error_message_petitionFacts[0]"]').should(
            'exist',
          );

          cy.get('[data-testid="petition-reason--1"]').focus();
          cy.get('[data-testid="petition-reason--1"]').type('REASON 1');

          cy.get('[data-testid="error_message_petitionReasons[0]"]').should(
            'not.exist',
          );

          cy.get('[data-testid="petition-fact--1"]').focus();
          cy.get('[data-testid="petition-fact--1"]').type('FACT 1');

          cy.get('[data-testid="error_message_petitionFacts[0]"]').should(
            'not.exist',
          );
        });

        it('should ignore unfilled extra facts and reasons if they are not filled in', () => {
          cy.get('[data-testid="petition-reason--1"]').focus();
          cy.get('[data-testid="petition-reason--1"]').type('REASON 1');

          cy.get('[data-testid="error_message_petitionReasons[0]"]').should(
            'not.exist',
          );

          cy.get('[data-testid="petition-fact--1"]').focus();
          cy.get('[data-testid="petition-fact--1"]').type('FACT 1');

          cy.get('[data-testid="add-another-reason-link-button"').click();
          cy.get('[data-testid="add-another-reason-link-button"').click();

          cy.get('[data-testid="add-another-fact-link-button"').click();
          cy.get('[data-testid="add-another-fact-link-button"').click();

          cy.get('[data-testid="petition-reason-0"').should('exist');
          cy.get('[data-testid="petition-reason-1"').should('exist');

          cy.get('[data-testid="petition-fact-0"').should('exist');
          cy.get('[data-testid="petition-fact-1"').should('exist');

          cy.get('[data-testid="step-2-next-button"]').click();
          cy.get('[data-testid="step-indicator-current-step-3-icon"]');
        });

        it('should be able to navigate to step 2 when the user fills in reason and fact correctly', () => {
          cy.get('[data-testid="petition-reason--1"]').focus();
          cy.get('[data-testid="petition-reason--1"]').type('REASON 1');

          cy.get('[data-testid="petition-fact--1"]').focus();
          cy.get('[data-testid="petition-fact--1"]').type('FACT 1');

          cy.get('[data-testid="step-2-next-button"]').click();
          cy.get('[data-testid="step-indicator-current-step-3-icon"]');
        });
      });

      describe('add facts and reasons', () => {
        it('should display empty textbox when text is removed', () => {
          cy.get('[data-testid="petition-reason--1"]').focus();
          cy.get('[data-testid="petition-reason--1"]').type('REASON 1');
          cy.get('[data-testid="petition-reason--1"]').blur();
          cy.get('[data-testid="petition-reason--1"]').focus();
          cy.get('[data-testid="petition-reason--1"]').type(
            '{selectall}{backspace}',
          );
          cy.get('[data-testid="petition-reason--1"]').should('be.visible');

          cy.get('[data-testid="petition-fact--1"]').focus();
          cy.get('[data-testid="petition-fact--1"]').type('FACT 1');
          cy.get('[data-testid="add-another-fact-link-button"]').click();
          cy.get('[data-testid="petition-fact-0"]').focus();
          cy.get('[data-testid="petition-fact-0"]').type('FACT 2');
          cy.get('[data-testid="petition-fact-0"]').blur();
          cy.get('[data-testid="petition-fact-0"]').focus();
          cy.get('[data-testid="petition-fact-0"]').type(
            '{selectall}{backspace}',
          );
          cy.get('[data-testid="petition-fact-0"]').should('be.visible');
        });
      });
    });

    describe('Upload PDF', () => {
      beforeEach(() => {
        cy.get('[data-testid="upload-a-petition-label"').should('exist');
        cy.get('[data-testid="upload-a-petition-label"').click();

        cy.get('[data-testid="step-2-next-button"]').should('exist');
        cy.get('[data-testid="step-2-next-button"]').should('be.disabled');

        cy.get(
          '[data-testid="petition-redaction-acknowledgement-label"]',
        ).should('exist');
        cy.get(
          '[data-testid="petition-redaction-acknowledgement-label"]',
        ).click();

        cy.get('[data-testid="step-2-next-button"]').should('not.be.disabled');
      });

      describe('VALIDATION MESSAGES', () => {
        it('should throw an error if user presses "Next" button without uploading a file', () => {
          cy.get('[data-testid="step-2-next-button"]').click();

          cy.get('[data-testid="petition-error-message-0"]').should('exist');
        });

        it('should remove error message when user uploads a file', () => {
          cy.get('[data-testid="step-2-next-button"]').click();

          cy.get('[data-testid="petition-error-message-0"]').should('exist');

          attachFile({
            filePath: '../../helpers/file/sample.pdf',
            selector: '#petition-file',
            selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
          });

          cy.get('[data-testid="petition-error-message-0"]').should(
            'not.exist',
          );
        });

        it('should be able to navigate to step 2 when the user uploads a petition correctly', () => {
          attachFile({
            filePath: '../../helpers/file/sample.pdf',
            selector: '#petition-file',
            selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
          });

          cy.get('[data-testid="petition-error-message-0"]').should(
            'not.exist',
          );

          cy.get('[data-testid="step-2-next-button"]').click();
          cy.get('[data-testid="step-indicator-current-step-3-icon"]');
        });
      });
    });
  });
});
