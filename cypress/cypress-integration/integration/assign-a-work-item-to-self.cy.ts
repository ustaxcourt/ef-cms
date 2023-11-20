import { retry } from '../../helpers/retry';

describe('Work item assignment', () => {
  it('petitionsClerk assigns a work item to themselves, docketClerk should NOT see that work item as unassigned', () => {
    cy.login('petitionsclerk', '/document-qc/section/inbox');
    cy.get('#section-work-queue').should('exist');
    cy.get('[data-testid="work-item-102-20"]')
      .find('[data-testid="checkbox-assign-work-item"]')
      .click();
    cy.get('[data-testid="dropdown-select-assignee"]').select(
      'Test Petitionsclerk',
    );

    retry(() => {
      cy.login('petitionsclerk', '/document-qc/section/inbox');
      cy.get('#section-work-queue').should('exist');
      return cy.get('body').then(body => {
        return (
          body.find(
            '[data-testid="work-item-102-20"] [data-testid="table-column-work-item-assigned-to"]:contains("Test Petitionsclerk")',
          ).length > 0
        );
      });
    }, 10);

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
