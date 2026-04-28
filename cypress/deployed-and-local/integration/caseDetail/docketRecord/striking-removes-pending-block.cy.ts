import { loginAsDocketClerk1 } from 'cypress/helpers/authentication/login-as-helpers';
import { createAndServePaperFiling } from 'cypress/helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';

const MAX_STRIKE_RETRIES = 3;

function strikeDocketEntry(attempt = 0) {
  cy.get('[data-testid="strike-entry"]').should('be.visible').click();
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(200);
  cy.get('body').then($body => {
    if ($body.find('[data-testid="modal-button-confirm"]').length > 0) {
      cy.get('[data-testid="modal-button-confirm"]')
        .should('be.visible')
        .click();
    } else if (attempt < MAX_STRIKE_RETRIES) {
      cy.log(
        `Strike modal did not appear, retrying (${attempt + 1}/${MAX_STRIKE_RETRIES})`,
      );
      strikeDocketEntry(attempt + 1);
    } else {
      throw new Error(
        'Strike docket entry modal did not appear after maximum retries',
      );
    }
  });
}

describe('Striking removes pending items', () => {
  beforeEach(() => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      cy.wrap(docketNumber).as('DOCKET_NUMBER');
    });
  });

  it('Should remove the case block when striking the only pending item.', () => {
    loginAsDocketClerk1();
    cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      goToCase(docketNumber);
      cy.get('[data-testid="edit-APW"]').click();
      cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
      cy.get('[data-testid="blocked-case-icon"]').should('exist'); // Assert case is blocked

      // Strike APW
      cy.get('[data-testid="edit-APW"]').click();
      cy.get('[data-testid="tab-action"]').click();
      strikeDocketEntry();

      cy.get('[data-testid="edit-APW"]'); // Wait for page to be fully loaded before next assert
      cy.get('[data-testid="blocked-case-icon"]').should('not.exist'); // Assert case is not blocked
    });
  });

  it('Should not remove the case block when striking one of multiple pending items.', () => {
    loginAsDocketClerk1();
    cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      goToCase(docketNumber);
      cy.get('[data-testid="edit-APW"]').click();
      cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
      cy.get('[data-testid="blocked-case-icon"]').should('exist'); // Assert case is blocked

      createAndServePaperFiling({
        dateReceived: '01/01/2022',
        documentType: 'Motion to Proceed Remotely',
      });

      // Strike APW
      cy.get('[data-testid="edit-APW"]').click();
      cy.get('[data-testid="tab-action"]').click();
      strikeDocketEntry();

      cy.get('[data-testid="blocked-case-icon"]').should('exist'); // Assert case is blocked
    });
  });

  it('Should remove the case block when striking all pending items', () => {
    loginAsDocketClerk1();
    cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      goToCase(docketNumber);
      cy.get('[data-testid="edit-APW"]').click();
      cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
      cy.get('[data-testid="blocked-case-icon"]').should('exist'); // Assert case is blocked

      createAndServePaperFiling({
        dateReceived: '01/01/2022',
        documentType: 'Motion to Proceed Remotely',
      });

      //Strike APW
      cy.get('[data-testid="edit-APW"]').click();
      cy.get('[data-testid="tab-action"]').click();
      strikeDocketEntry();

      cy.get('[data-testid="blocked-case-icon"]').should('exist'); // Assert case is still blocked

      //Strike MOTR
      cy.get('[data-testid="edit-MOTR"]').click();
      cy.get('[data-testid="tab-action"]').click();
      strikeDocketEntry();

      cy.get('[data-testid="edit-APW"]'); // Wait for page to be fully loaded before next assert
      cy.get('[data-testid="blocked-case-icon"]').should('not.exist'); // Assert case is not blocked
    });
  });
});
