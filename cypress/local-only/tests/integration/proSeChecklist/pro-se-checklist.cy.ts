import {
  loginAsPetitioner,
  loginAsPetitionsClerk,
  loginAsPrivatePractitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { petitionsClerkServesPetition } from 'cypress/helpers/documentQC/petitionsclerk-serves-petition';
import {
  createAndServePaperPetition,
  createAndServePaperPetitionMyselfAndSpouse,
} from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { createAndServePaperPetitionMultipleParties } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition-petitioner-and-spouse';
import {
  externalUserCreatesElectronicCase,
  externalUserCreatesElectronicCaseWithSpouseDifferentAddress,
  petitionerCreatesElectronicCaseWithSpouse,
} from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';

describe('appends pro se checklist', () => {
  it('appends pro se checklist if petitioner is pro se', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      goToCase(docketNumber);
      cy.get(
        `[data-testid="docket-entry-numberOfPages-${docketNumber}"]`,
      ).contains(2);
    });
  });
  it('appends pro se checklist for each the petitioner and spouse with different addresses and are pro se', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCaseWithSpouseDifferentAddress().then(
      docketNumber => {
        petitionsClerkServesPetition(docketNumber);
        goToCase(docketNumber);
        cy.get(
          `[data-testid="docket-entry-numberOfPages-${docketNumber}"]`,
        ).contains(4);
      },
    );
  });
  it('appends pro se checklist for the petitioner and spouse with the same address and are pro se', () => {
    loginAsPetitioner();
    petitionerCreatesElectronicCaseWithSpouse().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      goToCase(docketNumber);
      cy.get(
        `[data-testid="docket-entry-numberOfPages-${docketNumber}"]`,
      ).contains(2);
    });
  });
  it('does not append pro se checklist for a petitioner represented by counsel', () => {
    loginAsPrivatePractitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      goToCase(docketNumber);
      cy.get(
        `[data-testid="docket-entry-numberOfPages-${docketNumber}"]`,
      ).contains(1);
    });
  });
  it('does not append pro se checklist for petitioner and spouse with different addresses represented by counsel', () => {
    loginAsPrivatePractitioner();
    externalUserCreatesElectronicCaseWithSpouseDifferentAddress().then(
      docketNumber => {
        petitionsClerkServesPetition(docketNumber);
        goToCase(docketNumber);
        cy.get(
          `[data-testid="docket-entry-numberOfPages-${docketNumber}"]`,
        ).contains(2);
      },
    );
  });
  it('appends pro se checklist only for spouse, if petitioner is represented by counsel and spouse is not, are at different addresses', () => {
    loginAsPrivatePractitioner();
    externalUserCreatesElectronicCaseWithSpouseDifferentAddress().then(
      docketNumber => {
        loginAsPetitionsClerk();
        cy.intercept('GET', `**/cases/${docketNumber}*`).as('getCaseData');
        goToCase(docketNumber);
        cy.wait('@getCaseData').then(interception => {
          const petitioner = interception.response?.body?.petitioners?.[1];
          cy.wrap(petitioner).as('spouse');
        });
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('[data-testid="tab-parties"]').click();
        cy.get('[data-testid="edit-private-practitioner-counsel"]')
          .first()
          .click();
        cy.get('@spouse').then((petitioner: any) => {
          cy.get(
            `[data-testid="representing-${petitioner.contactId}"]`,
          ).click();
        });
        cy.get(
          '[data-testid="submit-edit-petitioner-information-button"]',
        ).click();

        petitionsClerkServesPetition(docketNumber);
        goToCase(docketNumber);
        cy.get(
          `[data-testid="docket-entry-numberOfPages-${docketNumber}"]`,
        ).contains(3);
      },
    );
  });
  it('appends pro se checklist for petitioner when petition filed by petitions clerk', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      goToCase(docketNumber);
      cy.get(
        `[data-testid="docket-entry-numberOfPages-${docketNumber}"]`,
      ).contains(2);
    });
  });
  it('appends pro se checklist for petitioner and spouse when petition filed by petitions clerk', () => {
    createAndServePaperPetitionMyselfAndSpouse().then(({ docketNumber }) => {
      goToCase(docketNumber);
      cy.get(
        `[data-testid="docket-entry-numberOfPages-${docketNumber}"]`,
      ).contains(2);
    });
  });
  it('appends pro se checklist for each petitioner and spouse of different addresses when petition is filed by petitions clerk', () => {
    createAndServePaperPetitionMultipleParties().then(({ docketNumber }) => {
      goToCase(docketNumber);
      cy.get(
        `[data-testid="docket-entry-numberOfPages-${docketNumber}"]`,
      ).contains(4);
    });
  });
});
