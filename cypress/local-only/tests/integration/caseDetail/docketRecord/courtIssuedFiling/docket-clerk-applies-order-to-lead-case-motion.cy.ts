import { goToCase } from '../../../../../../helpers/caseDetail/go-to-case';
import { loginAsDocketClerk1 } from '../../../../../../helpers/authentication/login-as-helpers';
import { createAndServePaperFiling } from 'cypress/helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { createDocketEntryAffectingOrderOnConsolidatedCase } from 'cypress/helpers/caseDetail/docketRecord/courtIssuedFiling/create-docket-entry-affecting-order';

describe('Docket clerk creates an order affecting other docket entries', function () {
  // Simplify this later
  it('should create an order to grant a motion with a link to said motion', () => {
    const leadCase = '111-19';
    const motionPurpose = 'Test motions';
    const orderTitle = 'Order to grant motion';
    const disposition = 'GRANTED';
    const displayedDisposition = 'GRANTING';

    loginAsDocketClerk1();
    goToCase(leadCase);

    // create motion on lead case
    createAndServePaperFiling({
      dateReceived: '10/23/2025', // use this as fileBy date on order later
      documentType: 'Motion',
      purpose: motionPurpose,
      isPaperCase: false,
    }).then(({ docketEntryId }) => {
      // Now check if new motion was added
      // get the last docket entry row
      cy.get(`[data-testid="${docketEntryId}"]`).should('exist');
      cy.get(`[data-testid="${docketEntryId}"]`)
        .find('td')
        .eq(1)
        .then($td => {
          const motionIndex = $td.text().trim();
          cy.wrap(motionIndex).as('motionIndex');
        });
      // create order and apply to lead case motion
      cy.get('@motionIndex').then(motionIndex => {
        createDocketEntryAffectingOrderOnConsolidatedCase(
          orderTitle,
          motionIndex,
          disposition,
        ).then(({ docketEntryId: orderDocketEntryId }) => {
          cy.get(`[data-testid="${orderDocketEntryId}"]`)
            .find('td')
            .eq(5)
            .then($td => {
              cy.get('@motionIndex').then(motionIndex => {
                expect($td.text().trim()).to.contain(
                  `${displayedDisposition} #${motionIndex}`,
                );
              });
            });
        });
      });
    });
  });
});
