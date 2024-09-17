import {
  fillCaseProcedureInformation,
  fillIrsNoticeInformation,
  fillMultipleIRSNotices,
  fillPetitionFileInformation,
  fillPetitionerInformation,
  fillStinInformation,
} from './petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition - Step 6 Review & Submit Case', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
    fillPetitionerInformation();
    fillPetitionFileInformation(VALID_FILE);
  });

  describe('IRS Notice Information', () => {
    describe('Edit step 3', () => {
      it('should navigate to petition flow step 3 when user clicks on edit button', () => {
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);
        cy.get('[data-testid="edit-petition-section-button-3"]').click();
        cy.get('[data-testid="step-indicator-current-step-3-icon"]').should(
          'be.visible',
        );
      });
    });
    describe('IRS notice', () => {
      it('should display IRS notice information for a single irs notice', () => {
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);
        cy.get(`[data-testid="irs-notice-info-${0}"]`).within(() => {
          cy.contains('IRS notice 1').should('exist');
          cy.contains('Notice of Deficiency').should('exist');
          cy.get('[data-testid="atp-preview-button"]').should(
            'have.text',
            'sample.pdf',
          );
        });
        cy.get(`[data-testid="irs-notice-info-${1}"]`).should('not.exist');
      });

      it('should display IRS notice information for a disclosure case type', () => {
        fillIrsNoticeInformation(VALID_FILE, 'Disclosure2');
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);
        cy.get(`[data-testid="irs-notice-info-${0}"]`).within(() => {
          cy.contains('IRS notice 1').should('exist');
          cy.contains(
            'Notice - We Are Going To Make Your Determination Letter Available for Public Inspection',
          ).should('exist');
          cy.get('[data-testid="atp-preview-button"]').should(
            'have.text',
            'sample.pdf',
          );
        });
        cy.get(`[data-testid="irs-notice-info-${1}"]`).should('not.exist');
      });
      it('should display IRS notice information for multiple IRS notices', () => {
        fillMultipleIRSNotices(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.get(`[data-testid="irs-notice-info-${0}"]`).within(() => {
          cy.contains('IRS notice 1').should('exist');
          cy.contains('Notice of Deficiency').should('exist');
          cy.contains('2024').should('exist');
          cy.contains('05/02/24').should('exist');
          cy.contains('Jackson, NJ').should('exist');
          cy.get('[data-testid="atp-preview-button"]').should(
            'have.text',
            'sample.pdf',
          );
        });

        cy.get(`[data-testid="irs-notice-info-${1}"]`).within(() => {
          cy.contains('IRS notice 2').should('exist');
          cy.contains(
            'Notice of Determination Concerning Collection Action',
          ).should('exist');
          cy.contains('2023').should('exist');
          cy.contains('05/02/23').should('exist');
          cy.contains('New York, NY').should('exist');
          cy.get('[data-testid="atp-preview-button"]').and(
            'have.text',
            'sample.pdf',
          );
        });
      });

      it('should display case type when user has no IRS notices', () => {
        cy.get('[data-testid="irs-notice-No"]').click();
        cy.get('[data-testid="case-type-select"]').select('Deficiency');
        cy.get('[data-testid="step-3-next-button"]').click();

        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);
        cy.get('[data-testid="irs-notice-type"]').within(() => {
          cy.contains('Type of notice/case').should('exist');
          cy.contains('Deficiency').should('exist');
        });
      });
    });
  });
});
