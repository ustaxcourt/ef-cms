import {
  fillCaseProcedureInformation,
  fillIrsNoticeInformation,
  fillPetitionFileInformation,
  fillPetitionerInformation,
  fillStinInformation,
} from './petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition - Step 7 Pay Filing Fee', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
    fillPetitionerInformation();
    fillPetitionFileInformation(VALID_FILE);
    fillIrsNoticeInformation(VALID_FILE);
    fillCaseProcedureInformation();
    fillStinInformation(VALID_FILE);
    // submit case info
  });

  describe('Pay Filing Fee', () => {
    it('should display the docket number of the created case', () => {
      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();
      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find resposne');
        const {docketNumber} = response.body;
        expect(response.body).to.have.property('docketNumber');

        // Try to find a success alert
        cy.get('[data-testid^="alert-success-"]', { timeout: 10000 })
          .should('exist')
          .first()
          .then($el => {
            cy.wrap($el)
                .should('contain.text', `Your case has been assigned docket number ${docketNumber}`)
                .and('contain.text', 'Your case has been created and your documents were sent to the U.S. Tax Court.');
          });
      });
    });
  });
});
