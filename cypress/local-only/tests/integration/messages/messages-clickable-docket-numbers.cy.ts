import {
  MessageRecipient,
  completeMessageFromMyInbox,
  sendMessageOnCase,
} from '../../../../helpers/messages/send-message-on-case';
import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { getCurrentDateTimeInMillis } from '@shared/business/utilities/DateHandler';
import {
  loginAsClerkOfCourt,
  loginAsColvin,
  loginAsColvinChambers,
  loginAsDocketClerk,
  loginAsPetitionsClerk1,
} from '../../../../helpers/authentication/login-as-helpers';

// createAndServePaperPetition defaults to a Regular "CDP (Lien/Levy)" case,
// which getDocketNumberSuffix maps to the "L" suffix.
const EXPECTED_SUFFIX = 'L';

const DOCKET_CLERK_RECIPIENT: MessageRecipient = {
  recipient: 'Test Docketclerk',
  section: 'docket',
};

describe('Messages - clickable docket numbers', () => {
  describe('My Messages and Section Messages', () => {
    it('should link the docket number to the docket record in the inbox, sent, and completed views', () => {
      const subject = `Clickable docket ${getCurrentDateTimeInMillis()}`;

      createAndServePaperPetition().then(({ docketNumber }) => {
        // Petitions clerk (sender) sends a message to the docket clerk
        loginAsPetitionsClerk1();
        sendMessageOnCase({
          docketNumber,
          subject,
          to: DOCKET_CLERK_RECIPIENT,
        });

        // Sender: My Messages > Sent and Section Messages > Sent
        cy.visit('/messages/my/outbox');
        assertDocketNumberLink({
          docketNumber,
          messageListId: 'messages-individual-outbox',
        });
        cy.visit('/messages/section/outbox');
        assertDocketNumberLink({
          docketNumber,
          messageListId: 'messages-section-outbox',
        });

        // Recipient: Section Messages > Inbox and My Messages > Inbox
        loginAsDocketClerk();
        cy.visit('/messages/section/inbox');
        assertDocketNumberLink({
          docketNumber,
          messageListId: 'messages-section-inbox',
        });
        cy.visit('/messages/my/inbox');
        assertDocketNumberLink({
          docketNumber,
          messageListId: 'messages-individual-inbox',
        });

        // Recipient completes the message
        completeMessageFromMyInbox(subject);

        // Recipient: Section Messages > Completed and My Messages > Completed
        cy.visit('/messages/section/completed');
        assertDocketNumberLink({
          docketNumber,
          messageListId: 'messages-section-completed',
        });
        cy.visit('/messages/my/completed');
        assertDocketNumberLink({
          docketNumber,
          messageListId: 'messages-individual-completed',
        });

        // Clicking the docket number navigates to the case's docket record
        clickDocketNumberLinkAndAssertDocketRecord({
          docketNumber,
          messageListId: 'messages-individual-completed',
        });
      });
    });

    it('should navigate to the docket record when a docket number in the My Messages inbox is clicked', () => {
      const subject = `Clickable docket ${getCurrentDateTimeInMillis()}`;

      createAndServePaperPetition().then(({ docketNumber }) => {
        loginAsPetitionsClerk1();
        sendMessageOnCase({
          docketNumber,
          subject,
          to: DOCKET_CLERK_RECIPIENT,
        });

        loginAsDocketClerk();
        cy.visit('/messages/my/inbox');
        clickDocketNumberLinkAndAssertDocketRecord({
          docketNumber,
          messageListId: 'messages-individual-inbox',
        });
      });
    });

    it('should navigate to the docket record when a docket number in the Section Messages sent view is clicked', () => {
      const subject = `Clickable docket ${getCurrentDateTimeInMillis()}`;

      createAndServePaperPetition().then(({ docketNumber }) => {
        loginAsPetitionsClerk1();
        sendMessageOnCase({
          docketNumber,
          subject,
          to: DOCKET_CLERK_RECIPIENT,
        });

        cy.visit('/messages/section/outbox');
        clickDocketNumberLinkAndAssertDocketRecord({
          docketNumber,
          messageListId: 'messages-section-outbox',
        });
      });
    });
  });

  describe('Recent Messages on dashboards', () => {
    const dashboardCases: {
      description: string;
      login: () => void;
      to: MessageRecipient;
    }[] = [
      {
        description: 'Judge',
        login: loginAsColvin,
        to: {
          chambers: 'colvinsChambers',
          recipient: 'Judge Colvin',
          section: 'Chambers',
        },
      },
      {
        description: 'Chambers',
        login: loginAsColvinChambers,
        to: {
          chambers: 'colvinsChambers',
          recipient: "Test Colvin's Chambers",
          section: 'Chambers',
        },
      },
      {
        description: 'Clerk of the Court',
        login: loginAsClerkOfCourt,
        to: {
          recipient: 'Test Clerk of Court',
          section: 'clerkofcourt',
        },
      },
    ];

    dashboardCases.forEach(({ description, login, to }) => {
      it(`should link the docket number to the docket record in Recent Messages on the ${description} dashboard`, () => {
        const subject = `Clickable docket ${getCurrentDateTimeInMillis()}`;

        createAndServePaperPetition().then(({ docketNumber }) => {
          loginAsPetitionsClerk1();
          sendMessageOnCase({ docketNumber, subject, to });

          cy.intercept('GET', '**/messages/**').as('getMessages');
          login();
          cy.get('#tabButton-recentMessages').click();
          cy.wait('@getMessages');

          cy.contains('tr', subject)
            .find(
              `[data-testid="recent-messages-docketNumber-cell"] a[href="/case-detail/${docketNumber}"]`,
            )
            .should('have.text', `${docketNumber}${EXPECTED_SUFFIX}`)
            .click();

          cy.url().should('include', `/case-detail/${docketNumber}`);
          cy.get('[data-testid="tab-docket-record"]').should('be.visible');
        });
      });
    });
  });
});

function getDocketNumberCellLink({
  docketNumber,
  messageListId,
}: {
  docketNumber: string;
  messageListId: string;
}): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy
    .get(
      `[data-testid="${messageListId}-docketNumber-cell"] a[href="/case-detail/${docketNumber}"]`,
    )
    .first();
}

function assertDocketNumberLink({
  docketNumber,
  messageListId,
}: {
  docketNumber: string;
  messageListId: string;
}): void {
  getDocketNumberCellLink({ docketNumber, messageListId }).should(
    'have.text',
    `${docketNumber}${EXPECTED_SUFFIX}`,
  );
}

function clickDocketNumberLinkAndAssertDocketRecord({
  docketNumber,
  messageListId,
}: {
  docketNumber: string;
  messageListId: string;
}): void {
  getDocketNumberCellLink({ docketNumber, messageListId }).click();
  cy.url().should('include', `/case-detail/${docketNumber}`);
  cy.get('[data-testid="tab-docket-record"]').should('be.visible');
}
