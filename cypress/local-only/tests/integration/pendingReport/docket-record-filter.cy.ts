import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { createAndServePaperFiling } from '../../../../helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { petitionsClerkQcsAndServesElectronicCase } from '../../../../helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';

describe('Pending motions and the docket record filter', () => {
  it('should keep the Pending motions visible after filtering the Docket Record to Orders', () => {
    const primaryFilerName = 'Pending Motion Petitioner';
    const motionTitles = ['Motion to Dismiss', 'Motion for a New Trial'];

    loginAsPetitioner();
    externalUserCreatesElectronicCase(
      primaryFilerName,
      'Phoenix, Arizona',
    ).then((docketNumber: string): void => {
      petitionsClerkQcsAndServesElectronicCase(docketNumber);
      loginAsDocketClerk1();
      goToCase(docketNumber);
      motionTitles.forEach((documentType: string): void => {
        createAndServePaperFiling({
          dateReceived: '01/01/2026',
          documentType,
          isPaperCase: false,
        });
        goToCase(docketNumber);
      });

      cy.get('[data-testid="tab-tracked-items"]').click();
      cy.get('[data-testid="pending-report-tab"]').click();
      motionTitles.forEach((title: string): void => {
        cy.contains('#pending-items .pending-item-row', title).should(
          'be.visible',
        );
      });

      cy.get('[data-testid="tab-docket-record"]').click();
      cy.get('#document-filter-by').should('be.visible').select('Orders');
      cy.get('#document-filter-by').should('have.value', 'Orders');

      cy.get('[data-testid="tab-tracked-items"]').click();
      cy.get('[data-testid="pending-report-tab"]').click();
      motionTitles.forEach((title: string): void => {
        cy.contains('#pending-items .pending-item-row', title).should(
          'be.visible',
        );
      });
    });
  });
});
