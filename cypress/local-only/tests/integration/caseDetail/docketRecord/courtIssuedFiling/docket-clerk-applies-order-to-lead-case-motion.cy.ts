import { goToCase } from '../../../../../../helpers/caseDetail/go-to-case';
import { loginAsDocketClerk1 } from '../../../../../../helpers/authentication/login-as-helpers';
import { createAndServePaperFiling } from 'cypress/helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { createDocketEntryAffectingOrderOnConsolidatedCase } from 'cypress/helpers/caseDetail/docketRecord/courtIssuedFiling/create-docket-entry-affecting-order';

describe('Docket clerk creates and edits draft order with selected docket numbers', function () {
  it('should create an order with ALL cases selected', () => {
    const leadCase = '111-19';
    const motionPurpose = 'Test motions';

    loginAsDocketClerk1();
    goToCase(leadCase);

    // create motion on lead case
    createAndServePaperFiling({
      dateReceived: '10/23/2025',
      documentType: 'Motion',
      purpose: motionPurpose,
      isPaperCase: false,
    });

    // Now check if new motion was added
    // get the last docket entry row
    cy.get('[data-testid="docket-record-table"] tbody tr')
      .last() // Get the last motion if multiple exist
      .within(() => {
        // / Capture the index value for later use
        cy.get('[data-testid^="docket-entry-index-"]')
          .invoke('text')
          .then(text => text.trim())
          .as('motionIndex'); // Store as alias

        cy.get('[data-testid^="docket-entry-filingsAndProceedings-"]')
          .should('be.visible')
          .within(() => {
            cy.get('button').should('contain.text', motionPurpose);
          });
      });

    // create order and apply to lead case motion
    cy.get('@motionIndex').then(motionIndex => {
      console.log(`Creating order for motion index: `, motionIndex);
      createDocketEntryAffectingOrderOnConsolidatedCase(
        'Order to deny motion',
        motionIndex,
      );
    });

    // Verify the order was created and references the correct motion
    // cy.get('[data-testid="docket-record-table"] tbody tr')
    // .last()
    // .within(() => {
    //   cy.get('[data-testid^="docket-entry-description-"]')
    //     .should('contain', motionIndex)
    //     .should('contain', 'Order');
    // });


  });
});
