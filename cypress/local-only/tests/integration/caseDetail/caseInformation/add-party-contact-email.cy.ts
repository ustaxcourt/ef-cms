import { faker } from '@faker-js/faker';
import {
  loginAsCaseServicesSupervisor,
  loginAsClerkOfCourt,
  loginAsDocketClerk1,
  loginAsPetitioner,
  loginAsPetitionsClerk1,
} from '../../../../../helpers/authentication/login-as-helpers';
import { goToCase } from '../../../../../helpers/caseDetail/go-to-case';
import { petitionsClerkServesPetition } from '../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { externalUserCreatesElectronicCase } from '../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';

const goToAddPartyAndFillRequiredFields = (
  docketNumber: string,
  partyName: string,
): void => {
  goToCase(docketNumber);
  cy.get('[data-testid="tab-case-information"]').click();
  cy.get('[data-testid="tab-parties"]').click();
  cy.get('[data-testid="button-add-party"]').click();
  cy.get('[data-testid="add-petitioner-contact-type"]').select('petitioner');
  cy.get('[data-testid="add-petitioner-name"]').type(partyName);
  cy.get('[data-testid="contact.address1"]').type('123 Main St');
  cy.get('[data-testid="contact.city"]').type('Charlotte');
  cy.get('[data-testid="contact.state"]').select('DE');
  cy.get('[data-testid="contact.postalCode"]').type('11111');
  cy.get('[data-testid="add-petitioner-phone"]').type('1234567890');
  cy.get('[data-testid="service-type-none-label-form.contact"]').click();
};

describe('Add Party - Contact Email Address', () => {
  let docketNumber: string;

  before(() => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(createdDocketNumber => {
      docketNumber = createdDocketNumber;
      loginAsPetitionsClerk1();
      petitionsClerkServesPetition(docketNumber);
    });
  });

  [
    { login: loginAsDocketClerk1, role: 'docket clerk' },
    { login: loginAsCaseServicesSupervisor, role: 'case services supervisor' },
    { login: loginAsClerkOfCourt, role: 'clerk of court' },
  ].forEach(({ login, role }) => {
    describe(`as a ${role}`, () => {
      it('should display the optional contact email address field directly after the phone number field', () => {
        login();
        goToCase(docketNumber);
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('[data-testid="tab-parties"]').click();
        cy.get('[data-testid="button-add-party"]').click();

        cy.get('label[for="contactEmailAddress"]').should(
          'contain.text',
          'Contact email address (optional)',
        );
        cy.get('[data-testid="add-petitioner-phone"]')
          .closest('.usa-form-group')
          .next('.usa-form-group')
          .find('[data-testid="add-petitioner-contact-email"]')
          .should('exist');
      });

      it('should show a validation error on save for an invalid contact email address and clear it once corrected', () => {
        login();
        goToAddPartyAndFillRequiredFields(
          docketNumber,
          faker.person.firstName(),
        );

        cy.get('[data-testid="add-petitioner-contact-email"]').type(
          'not-an-email',
        );
        cy.get('[data-testid="add-petitioner-submit-button"]').click();

        cy.get('[data-testid="add-petitioner-to-case-container"]').should(
          'exist',
        );
        cy.get('[data-testid="add-petitioner-contact-email-error"]').should(
          'contain.text',
          'Enter email address in format: yourname@example.com',
        );

        cy.get('[data-testid="add-petitioner-contact-email"]').clear();
        cy.get('[data-testid="add-petitioner-contact-email"]').type(
          faker.internet.email(),
        );
        cy.get('[data-testid="add-petitioner-contact-email"]').blur();
        cy.get('[data-testid="add-petitioner-contact-email-error"]').should(
          'not.exist',
        );
      });

      it('should save the contact email address and display it on the parties tab', () => {
        const partyName = faker.person.firstName();
        const contactEmailAddress = faker.internet.email();

        login();
        goToAddPartyAndFillRequiredFields(docketNumber, partyName);
        cy.get('[data-testid="add-petitioner-contact-email"]').type(
          contactEmailAddress,
        );
        cy.get('[data-testid="add-petitioner-submit-button"]').click();

        cy.get('[data-testid="success-alert"]').should(
          'contain.text',
          `${partyName} has been added to the case.`,
        );
        cy.contains(
          '[data-testid="petitioner-paper-petition-email"]',
          contactEmailAddress,
        ).should('exist');
      });

      it('should allow adding a party without a contact email address', () => {
        const partyName = faker.person.firstName();

        login();
        goToAddPartyAndFillRequiredFields(docketNumber, partyName);
        cy.get('[data-testid="add-petitioner-submit-button"]').click();

        cy.get('[data-testid="success-alert"]').should(
          'contain.text',
          `${partyName} has been added to the case.`,
        );
      });
    });
  });
});
