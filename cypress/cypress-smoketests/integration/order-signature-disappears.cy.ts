import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../helpers/auth/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../helpers/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../helpers/petitionsclerk-serves-petition';
import { searchByDocketNumberInHeader } from '../../helpers/search-by-docket-number-in-header';

describe('BUG: order signature disappears', () => {
  before(() => {
    loginAsPetitioner();
    petitionerCreatesElectronicCase().then(docketNumber => {
      cy.wrap(docketNumber).as('DOCKET_NUMBER');
      petitionsClerkServesPetition(docketNumber);
    });
  });

  beforeEach(() => {
    cy.keepAliases();
  });

  it('should not ask the user to sign an order in the drafts if already signed it when created', () => {
    loginAsDocketClerk1();
    cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      console.log('docketNumber', docketNumber);
      searchByDocketNumberInHeader(docketNumber);
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-create-order"]').click();
      cy.get('[data-testid="event-code-select"]').select('O');
      cy.get('[data-testid="create-order-document-title"]').clear();
      cy.get('[data-testid="create-order-document-title"]').type('Order');
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="create-order-page-title"]');
      cy.get('.ql-editor').click();
      cy.get('[data-testid="save-order-button"]').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();
      cy.get('[data-testid="signature-required-label"]').should('not.exist');

      const threeMinutes = 4 * 60 * 1000;
      cy.wait(threeMinutes);

      cy.reload(true);
      cy.get('[data-testid="tab-drafts"]').click();
      cy.get('[data-testid="docket-entry-description-1"]').click();
      cy.get('[data-testid="view-full-pdf-button"]').should('exist');
      cy.get('[data-testid="signature-required-label"]').should('not.exist');

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(6000);
    });
  });
});
