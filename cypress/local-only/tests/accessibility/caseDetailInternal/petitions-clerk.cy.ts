import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Case Detail Page - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });
  describe('Case detail menu', () => {
    it('should be free of a11y issues when adding message', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/105-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#case-detail-menu-button').click();
      cy.get('#menu-button-add-new-message').click();
      cy.get('.ustc-create-message-modal').should('exist');

      checkA11y();
    });

    it('should be free of a11y issues when creating order', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/105-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#case-detail-menu-button').click();
      cy.get('#menu-button-create-order').click();
      cy.get('#eventCode').should('exist');

      checkA11y();
    });

    it('should be free of a11y issues when adding deadline', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/105-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#case-detail-menu-button').click();
      cy.get('#menu-button-add-deadline').click();
      cy.get('#deadline-date-picker').should('exist');

      checkA11y();
    });
  });

  describe('Docket record tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/101-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');

      checkA11y();
    });

    describe('Document view tab', () => {
      it('should be free of a11y issues', () => {
        loginAsPetitionsClerk();

        cy.visit(
          '/case-detail/103-20/document-view?docketEntryId=ac62f25a-49f9-46a5-aed7-d6b955a2dc34',
        );
        cy.get('#tabContent-documentView').should('exist');

        checkA11y();
      });
    });
  });

  describe('Case information tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/101-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-case-information').click();

      checkA11y();
    });

    it('should be free of a11y issues for manual and automatic block', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/109-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-case-information').click();
      cy.get('#blocked-from-trial-header').should('exist');

      checkA11y();
    });

    it('should be free of a11y issues when adding and editing calendar note', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/108-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-case-information').click();
      cy.get('#edit-case-trial-information-btn').click();
      cy.get('#add-edit-calendar-note').click();
      cy.get('.add-edit-calendar-note-modal').should('exist');

      checkA11y();
    });

    it('should be free of a11y issues when adding trial session', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/104-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-case-information').click();
      cy.get('#add-to-trial-session-btn').click();
      cy.get('#add-to-trial-session-modal').should('exist');

      checkA11y();
    });

    it('should be free of a11y issues when removing trial session', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/108-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-case-information').click();
      cy.get('#edit-case-trial-information-btn').click();
      cy.get('#remove-from-trial-session-btn').click();
      cy.get('#remove-from-trial-session-modal').should('exist');

      checkA11y();
    });

    it('should be free of a11y issues when prioritizing case', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/101-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-case-information').click();
      cy.get('.high-priority-btn').click();
      cy.get('#prioritize-case-modal').should('exist');

      checkA11y();
    });

    it('should be free of a11y issues when unprioritizing case', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/110-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-case-information').click();
      cy.get('#remove-high-priority-btn').click();
      cy.get('#unprioritize-modal').should('exist');

      checkA11y();
    });

    describe('Statistics tab', () => {
      it('should be free of a11y issues', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/110-19');
        cy.get('[data-testid="docket-record-table"]').should('exist');
        cy.get('#tab-case-information').click();
        cy.get('#tab-statistics').click();
        cy.get('#tabContent-statistics').should('exist');

        checkA11y();
      });

      it('should be free of a11y issues when adding other statistics', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/101-19/add-other-statistics');
        cy.contains('Add Other Statistics');

        checkA11y();
      });

      it('should be free of a11y issues when editing other statistics', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/101-19/edit-other-statistics');
        cy.contains('Edit Other Statistics').should('exist');

        checkA11y();
      });

      it('should be free of a11y issues when deleting other statistics', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/101-19/edit-other-statistics');
        cy.contains('Edit Other Statistics');
        cy.get('button.red-warning').click();
        cy.get('#modal-root').should('exist');

        checkA11y();
      });

      it('should be free of a11y issues when adding deficiency statistics', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/105-20/add-deficiency-statistics');
        cy.get('.add-deficiency-statistics-form').should('exist');

        checkA11y();
      });

      it('should be free of a11y issues when editing deficiency statistics', () => {
        loginAsPetitionsClerk();

        cy.visit(
          '/case-detail/105-20/edit-deficiency-statistic/cb557361-50ee-4440-aaff-0a9f1bfa30ed',
        );
        cy.get('.add-deficiency-statistics-form').should('exist');

        checkA11y();
      });

      it('should be free of a11y issues when deleting deficiency statistics', () => {
        loginAsPetitionsClerk();

        cy.visit(
          '/case-detail/105-20/edit-deficiency-statistic/cb557361-50ee-4440-aaff-0a9f1bfa30ed',
        );
        cy.get('.add-deficiency-statistics-form').should('exist');
        cy.get('button.red-warning').click();
        cy.get('#modal-root').should('exist');

        checkA11y();
      });
    });

    describe('Parties tab', () => {
      it('should be free of a11y issues', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/102-19');
        cy.get('[data-testid="docket-record-table"]').should('exist');
        cy.get('#tab-case-information').click();
        cy.get('#tab-parties').click();

        checkA11y();
      });

      it('should be free of a11y issues when adding practitioner', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/102-19');
        cy.get('[data-testid="docket-record-table"]').should('exist');
        cy.get('#tab-case-information').click();
        cy.get('#tab-parties').click();
        cy.get('#practitioner-search-field').type('GL1111');
        cy.get('#search-for-practitioner').click();
        cy.get('#counsel-matches-legend').should('exist');

        checkA11y();
      });

      it('should be free of a11y issues when viewing respondent counsel tertiary tabs', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/999-15');
        cy.get('[data-testid="docket-record-table"]').should('exist');
        cy.get('#tab-case-information').click();
        cy.get('#tab-parties').click();
        cy.get('#respondent-counsel').click();
        cy.get('#edit-respondent-counsel').click();

        checkA11y();
      });

      it('should be free of a11y issues when adding respondent', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/102-19');
        cy.get('[data-testid="docket-record-table"]').should('exist');
        cy.get('#tab-case-information').click();
        cy.get('#tab-parties').click();
        cy.get('#respondent-counsel').click();
        cy.get('#respondent-search-field').type('WN7777');
        cy.get('#search-for-respondent').click();
        cy.get('#counsel-matches-legend').should('exist');

        checkA11y();
      });

      it('should be free of a11y issues when editing respondent', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/103-19/edit-respondent-counsel/RT6789');
        cy.get('#submit-edit-respondent-information').should('exist');

        checkA11y();
      });

      it('should be free of a11y issues for sealed addresses', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/102-19');
        cy.get('[data-testid="docket-record-table"]').should('exist');
        cy.get('#tab-case-information').click();
        cy.get('#tab-parties').click();
        cy.get('.sealed-address').should('exist');

        checkA11y();
      });
    });
  });

  describe('Drafts tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/109-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-case-information').click();
      cy.get('#tab-drafts').click();

      checkA11y();
    });

    it('should be free of a11y issues when editing signed draft', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/109-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-case-information').click();
      cy.get('#tab-drafts').click();
      cy.get('#edit-order-button').click();
      cy.get('.modal-button-confirm').should('exist');

      checkA11y();
    });
  });

  describe('Tracked items tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/107-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-tracked-items').click();

      checkA11y();
    });

    describe('Pending report tab', () => {
      it('should be free of a11y issues', () => {
        loginAsPetitionsClerk();

        cy.visit('/case-detail/107-19');
        cy.get('[data-testid="docket-record-table"]').should('exist');
        cy.get('#tab-tracked-items').click();
        cy.get('#tab-pending-report').click();

        checkA11y();
      });
    });
  });

  describe('Case messages tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/101-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-case-messages').click();

      checkA11y();
    });
  });

  describe('Correspondence tab', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/103-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-correspondence').click();
      cy.get('.document-viewer--documents').should('exist');

      checkA11y();
    });

    it('should be free of a11y issues when uploading correspondence', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/103-19/upload-correspondence');
      cy.get('#upload-correspondence').should('exist');

      checkA11y();
    });

    it('should be free of a11y issues when editing correspondence', () => {
      loginAsPetitionsClerk();

      cy.visit('/case-detail/103-19');
      cy.get('[data-testid="docket-record-table"]').should('exist');
      cy.get('#tab-correspondence').click();
      cy.get('.document-viewer--documents').should('exist');
      cy.get('.edit-correspondence-button').click();
      cy.get('#edit-correspondence-header').should('exist');

      checkA11y();
    });
  });
});
