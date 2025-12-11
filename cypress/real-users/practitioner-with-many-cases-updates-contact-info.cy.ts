import { faker } from '@faker-js/faker';
import { formatNow } from '@shared/business/utilities/DateHandler';
import { loginAsPractitionerWithManyCases } from 'cypress/helpers/authentication/login-as-helpers';
import {
  changeEmailTo,
  clickChangeEmail,
  clickConfirmModal,
  confirmEmailPendingAlert,
  goToMyAccount,
} from 'cypress/local-only/support/pages/my-account';
import { v4 } from 'uuid';

describe('Practioner with many cases updates phone number and address', () => {
  let oldEmail: string = '';
  let cases: string[];

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
    cy.task('getPractionerWithMostCasesEmail').as('EMAIL');
    cy.get('@EMAIL').then(email => {
      oldEmail = email.toString();
      cy.task('getOpenAndRecentCasesByEmail', email).then(resultCases => {
        cases = resultCases as string[];
      });
      loginAsPractitionerWithManyCases(oldEmail);
    });
  });

  it.only('should update phone numbers on all open cases or cases closed within past 6 months', () => {
    const startTime = formatNow();
    goToMyAccount();

    // update practitioner number
    cy.get('[data-testid="edit-contact-info"]').click();
    cy.get('[data-testid="phone-number-input"]').click();
    cy.get('[data-testid="phone-number-input"]').clear();
    cy.get('[data-testid="phone-number-input"]').type(faker.phone.number());
    cy.get('[data-testid="save-edit-contact"]').click();

    cy.get('[data-testid="success-alert"]', { timeout: 7200000 }).should(
      'exist',
    );

    // check docket record that phone number document is on the docket record of each case
    cy.task('getRecentEventsByCode', {
      eventCode: 'NCP',
      cases,
      dateStart: startTime,
    }).as('RECENT_EVENTS');

    cy.get('@RECENT_EVENTS').then(recentEvents => {
      const casesFiledIn = Object.keys(recentEvents);
      expect(casesFiledIn).to.have.all.members(cases);
    });
  });

  it('should update addresses on all open cases or cases closed within past 6 months', () => {
    const startTime = formatNow();
    goToMyAccount();

    // update practitioner address
    cy.get('[data-testid="edit-contact-info"]').click();
    cy.get('[data-testid="contact.address1"]').clear();
    cy.get('[data-testid="contact.address1"]').type(
      faker.location.streetAddress(),
    );
    cy.get('[data-testid="save-edit-contact"]').click();
    cy.get('[data-testid="success-alert"]', { timeout: 7200000 }).should(
      'exist',
    );

    cy.task('getRecentEventsByCode', {
      eventCode: 'NCA',
      cases,
      dateStart: startTime,
    }).as('RECENT_EVENTS');

    cy.get('@RECENT_EVENTS').then(recentEvents => {
      const casesFiledIn = Object.keys(recentEvents);
      expect(casesFiledIn).to.have.all.members(cases);
    });
  });

  // NCAP
  it('should update phone and addresses on all open cases or cases closed within past 6 months', () => {
    const startTime = formatNow();
    goToMyAccount();

    // update practitioner number
    cy.get('[data-testid="edit-contact-info"]').click();
    cy.get('[data-testid="phone-number-input"]').click();
    cy.get('[data-testid="phone-number-input"]').clear();
    cy.get('[data-testid="phone-number-input"]').type(faker.phone.number());
    cy.get('[data-testid="contact.address1"]').clear();
    cy.get('[data-testid="contact.address1"]').type(
      faker.location.streetAddress(),
    );
    cy.get('[data-testid="save-edit-contact"]').click();

    cy.get('[data-testid="success-alert"]', { timeout: 7200000 }).should(
      'exist',
    );

    cy.task('getRecentEventsByCode', {
      eventCode: 'NCAP',
      cases,
      dateStart: startTime,
    }).as('RECENT_EVENTS');

    cy.get('@RECENT_EVENTS').then(recentEvents => {
      const casesFiledIn = Object.keys(recentEvents);
      expect(casesFiledIn).to.have.all.members(cases);
    });
  });

  // NOCE
  it('should update email for practitioner', () => {
    const updatedEmail = `cypress_test_account+new${v4()}@example.com`;
    let oldEmailUserId: string;
    let updatedEmailUserId: string;

    cy.task('getUserByEmail', oldEmail).then(user => {
      oldEmailUserId = (user as { userId: string }).userId;
    });

    // update practitioner email
    goToMyAccount();
    clickChangeEmail();
    changeEmailTo(updatedEmail);
    clickConfirmModal();
    confirmEmailPendingAlert();

    loginAsPractitionerWithManyCases(oldEmail);
    cy.task('getEmailVerificationToken', {
      email: oldEmail,
    }).then(verificationToken => {
      cy.visit(`/verify-email?token=${verificationToken}`);
    });

    cy.get('[data-testid="success-alert"]')
      .should('be.visible')
      .and(
        'contain.text',
        'Your email address is verified. You can now log in to DAWSON.',
      );
    cy.url().should('contain', '/login');

    loginAsPractitionerWithManyCases(updatedEmail);

    cy.task('getUserByEmail', updatedEmail).then(user => {
      updatedEmailUserId = (user as { userId: string }).userId;
      expect(updatedEmailUserId).to.equal(
        oldEmailUserId,
        'UserId for updated email should be the same from old email',
      );
    });

    // reset email to old email
    goToMyAccount();
    cy.get('[data-testid="user-service-email"]').should(
      'contain',
      updatedEmail,
    );
    clickChangeEmail();
    changeEmailTo(oldEmail);
    clickConfirmModal();
    confirmEmailPendingAlert();

    cy.task('getEmailVerificationToken', {
      email: updatedEmail,
    }).then(verificationToken => {
      cy.visit(`/verify-email?token=${verificationToken}`);
    });

    cy.get('[data-testid="success-alert"]')
      .should('be.visible')
      .and(
        'contain.text',
        'Your email address is verified. You can now log in to DAWSON.',
      );
    cy.url().should('contain', '/login');

    // log back in with old email to finish test
    loginAsPractitionerWithManyCases(oldEmail);
    goToMyAccount();
    cy.get('[data-testid="user-service-email"]').should('contain', oldEmail);
  });
});
