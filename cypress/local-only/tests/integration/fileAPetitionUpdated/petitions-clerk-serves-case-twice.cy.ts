import { INITIAL_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';
import { loginAsPetitioner } from 'cypress/helpers/authentication/login-as-helpers';
import { petitionsClerkQcsAndServesElectronicCase } from 'cypress/helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';
import { externalUserCreatesElectronicCase } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';

describe('petitions clerk should not be able to serve a case twice', () => {
  it('should show an error modal if a petitions clerk attempts to serve a case after it has already been served', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkQcsAndServesElectronicCase(docketNumber, {
        checkOrderToShowCause: false,
        checkNoticeOfAttachments: false,
        checkOrderForAmendedPetition: false,
      });
      cy.task('getDocketEntryIdsByDocketNumberAndEventCode', {
        docketNumber,
        eventCode: INITIAL_DOCUMENT_TYPES.petition.eventCode,
      }).as('PETITION_DOCKET_ENTRY_IDS');

      cy.get('@PETITION_DOCKET_ENTRY_IDS').then(petitionDocketEntryIds => {
        const petitionDocketEntryId = (
          petitionDocketEntryIds as unknown as { docketEntryId: string }[]
        )[0].docketEntryId;
        cy.visit(
          `/case-detail/${docketNumber}/documents/${petitionDocketEntryId}/review`,
        );
        cy.get('[data-testid="serve-case-to-irs"]').click();
        cy.get('[data-testid="modal-confirm"]').click();

        cy.get(
          '[data-testid="serve-case-to-irs-duplicate-error-modal"]',
        ).should('exist');

        cy.get('[data-testid="modal-button-confirm"]').click();

        cy.location('pathname').should('equal', `/case-detail/${docketNumber}`);

        cy.get('[data-testid="tab-drafts"]').click();
        cy.get('.document-viewer--documents-list')
          .children()
          .should('have.length', 1);
        cy.get('#docket-entry-description-0').should('have.text', 'Order');
      });
    });
  });
});
