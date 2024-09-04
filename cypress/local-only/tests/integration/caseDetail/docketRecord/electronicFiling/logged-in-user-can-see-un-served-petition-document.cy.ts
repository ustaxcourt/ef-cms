import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCaseForBusiness } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';

describe('Logged In User Can See Un-Served Petition Document', () => {
  it('should display a preview link to ["P", "ATP", "DISC"] documents for the Petitioner that created the case', () => {
    loginAsPetitioner();
    petitionerCreatesElectronicCaseForBusiness().as('DOCKET_NUMBER');

    loginAsPetitioner('petitioner1');
    cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      externalUserSearchesDocketNumber(docketNumber);
    });

    cy.get('[data-testid="docket-record-table"]').should('exist');
    cy.get('[data-testid="document-download-link-P"]').should('exist');
    cy.get('[data-testid="document-download-link-DISC"]').should('exist');
    cy.get('[data-testid="document-download-link-ATP"]').should('exist');

    loginAsPetitioner('petitioner2');
    cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      externalUserSearchesDocketNumber(docketNumber);
    });

    cy.get('[data-testid="docket-record-table"]').should('exist');
    cy.get('[data-testid="document-download-link-P"]').should('not.exist');
    cy.get('[data-testid="document-download-link-DISC"]').should('not.exist');
    cy.get('[data-testid="document-download-link-ATP"]').should('not.exist');

    loginAsDocketClerk1();
    cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
      cy.get('[data-testid="search-docket-number"]').click();
    });

    cy.get('[data-testid="docket-record-table"]').should('exist');
    cy.get('[data-testid="document-viewer-link-P"]').should('exist');
    cy.get('[data-testid="document-viewer-link-DISC"]').should('exist');
    cy.get('[data-testid="document-viewer-link-ATP"]').should('exist');
  });

  it('should display a preview link to ["P", "ATP", "DISC"] documents for the Private Practitioner that created the case', () => {
    loginAsPrivatePractitioner();
    petitionerCreatesElectronicCaseForBusiness().as('DOCKET_NUMBER');

    loginAsPrivatePractitioner('privatePractitioner1');
    cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      externalUserSearchesDocketNumber(docketNumber);
    });

    cy.get('[data-testid="docket-record-table"]').should('exist');
    cy.get('[data-testid="document-download-link-P"]').should('exist');
    cy.get('[data-testid="document-download-link-DISC"]').should('exist');
    cy.get('[data-testid="document-download-link-ATP"]').should('exist');

    loginAsPrivatePractitioner('privatePractitioner2');
    cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      externalUserSearchesDocketNumber(docketNumber);
    });

    cy.get('[data-testid="docket-record-table"]').should('exist');
    cy.get('[data-testid="document-download-link-P"]').should('not.exist');
    cy.get('[data-testid="document-download-link-DISC"]').should('not.exist');
    cy.get('[data-testid="document-download-link-ATP"]').should('not.exist');

    loginAsDocketClerk1();
    cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      cy.get('[data-testid="docket-number-search-input"]').type(docketNumber);
      cy.get('[data-testid="search-docket-number"]').click();
    });

    cy.get('[data-testid="docket-record-table"]').should('exist');
    cy.get('[data-testid="document-viewer-link-P"]').should('exist');
    cy.get('[data-testid="document-viewer-link-DISC"]').should('exist');
    cy.get('[data-testid="document-viewer-link-ATP"]').should('exist');
  });
});
