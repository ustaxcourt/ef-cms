import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../../helpers/authentication/login-as-helpers';
import { selectTypeaheadInput } from '../../../../../helpers/components/typeAhead/select-typeahead-input';
import { petitionsClerkServesPetition } from '../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { petitionerCreatesElectronicCaseWithSpouse } from '../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';

describe('Edit Petitioner Contact Information', () => {
  let docketNumber: string;
  let petitionerSpouseContactId: string;

  before(() => {
    loginAsPetitioner();
    petitionerCreatesElectronicCaseWithSpouse('Jane').then(
      docketNumberWithSuffix => {
        docketNumber = docketNumberWithSuffix;
        cy.intercept('GET', `**/cases/${docketNumber}?*`).as('getCase');
        petitionsClerkServesPetition(docketNumber);
        cy.wait('@getCase').then(({ response }) => {
          petitionerSpouseContactId = response?.body.petitioners.find(
            (petitioner: { email?: string }) => petitioner.email === undefined,
          ).contactId;
        });
      },
    );
  });

  it('should allow petitioner to edit their contact information', () => {
    loginAsPetitioner();
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('[data-testid="tab-case-information"]').click();
    cy.get('[data-testid="tab-parties"]').click();
    cy.get('[data-testid="edit-petitioner-button"]').click();
    cy.get('[data-testid="contact.address1"]').type('updated');
    cy.get('[data-testid="submit-contact-edit-button"]').click();
    cy.get('[data-testid="success-alert"]').contains('Changes saved');
  });

  it("should not allow petitioner to edit other petitioner's contact information", () => {
    loginAsPetitioner();
    cy.visit(
      `/case-detail/${docketNumber}/contacts/${petitionerSpouseContactId}/edit`,
    ).then(() => {
      cy.url().should('include', '/404');
    });
  });

  it('should allow practitioner to edit the contact information of the petitioner they represent', () => {
    loginAsPrivatePractitioner();
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('[data-testid="request-represent-a-party-button"]').click();
    selectTypeaheadInput(
      'case-association-document-type-search',
      'Entry of Appearance',
    );
    cy.get('[data-testid="filer-Jane, Petitioner"]').click();
    cy.get('[data-testid="request-access-submit-document"]').click();
    cy.get('[data-testid="submit-represent-a-party-button"]').click();
    cy.get('[data-testid="tab-case-information"]').click();
    cy.get('[data-testid="tab-parties"]').click();
    cy.get('[data-testid="edit-petitioner-button"]').click();
    cy.get('[data-testid="contact.address1"]').type('updated');
    cy.get('[data-testid="submit-contact-edit-button"]').click();
    cy.get('[data-testid="success-alert"]').contains('Changes saved');
  });

  it('should not allow practitioner to edit the contact information of the petitioner they do not represent', () => {
    loginAsPrivatePractitioner();
    cy.visit(
      `/case-detail/${docketNumber}/contacts/${petitionerSpouseContactId}/edit`,
    ).then(() => {
      cy.url().should('include', '/404');
    });
  });
});
