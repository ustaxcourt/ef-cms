import { loginAsPetitioner } from '../../helpers/auth/login-as-helpers';
import { petitionerCreatesEletronicCase } from '../../helpers/petitioner-creates-electronic-case';

describe('Work item assignment', () => {
  it('petitionsClerk assigns a work item to themselves, docketClerk should NOT see that work item as unassigned', () => {
    loginAsPetitioner();
    petitionerCreatesEletronicCase().then(docketNumber => {
      cy.login('petitionsclerk', '/document-qc/section/inbox');
      cy.get('#section-work-queue').should('exist');
      cy.get(`[data-testid="work-item-${docketNumber}"]`)
        .find('[data-testid="checkbox-assign-work-item"]')
        .click();
      cy.get('[data-testid="dropdown-select-assignee"]').select(
        'Test Petitionsclerk',
      );

      cy.login('petitionsclerk', '/document-qc/section/inbox');
      cy.get('#section-work-queue').should('exist');
      cy.get('body').then(body => {
        return (
          body.find(
            `[data-testid="work-item-${docketNumber}"] [data-testid="table-column-work-item-assigned-to"]:contains("Test Petitionsclerk")`,
          ).length > 0
        );
      });

      cy.login('docketclerk', '/document-qc/section/inbox');
      cy.get('[data-testid="checkbox-select-all-workitems"]').click();
      cy.get('.message-select-control input:checked').then(elm => {
        cy.get('.assign-work-item-count-docket').should(
          'contain',
          elm.length - 1,
        );
      });
      cy.get('[data-testid="dropdown-select-assignee"]').select('Unassigned');
      cy.get('.message-select-control input:checked').should('have.length', 0);
    });
  });
});
