import { assertExists, retry } from '../../helpers/retry';
import { attachDummyFile } from '../../helpers/attach-file';
import {
  loginAsAdmissionsClerk,
  loginAsPetitioner,
} from '../../helpers/auth/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../helpers/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../helpers/petitionsclerk-serves-petition';
import { searchByDocketNumberInHeader } from '../../helpers/search-by-docket-number-in-header';

describe('Document QC Complete', () => {
  let CASE_SERVICE_SUPERVISOR_INFO: { userId: string; name: string } =
    undefined as unknown as { userId: string; name: string };
  let DOCKET_CLERK_INFO: { userId: string; name: string } =
    undefined as unknown as { userId: string; name: string };

  const docketSectionMessage = 'To CSS under Docket Section';
  const petitionsSectionMessage = 'To CSS under Petitions Section';

  before(() => {
    cy.intercept('GET', '**/users', req => {
      req.on('before:response', res => {
        if (!CASE_SERVICE_SUPERVISOR_INFO) {
          CASE_SERVICE_SUPERVISOR_INFO = res.body;
        } else if (!DOCKET_CLERK_INFO) {
          DOCKET_CLERK_INFO = res.body;
        }
      });
    });

    cy.login('caseServicesSupervisor1');
    cy.login('docketclerk1');

    loginAsPetitioner();
    petitionerCreatesElectronicCase().then(docketNumber => {
      cy.wrap(docketNumber).as('DOCKET_NUMBER');
      petitionsClerkServesPetition(docketNumber);
      petitionerFilesADocument(docketNumber);
    });

    loginAsPetitioner();
    petitionerCreatesElectronicCase().then(docketNumber => {
      cy.wrap(docketNumber).as('UNSERVED_DOCKET_NUMBER');
    });
  });

  beforeEach(() => {
    cy.keepAliases();
  });

  it('should organize messages correctly in each section', () => {
    cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      loginAsAdmissionsClerk();
      searchByDocketNumberInHeader(docketNumber);

      sendMessages(
        CASE_SERVICE_SUPERVISOR_INFO.userId,
        docketSectionMessage,
        'docket',
      );

      sendMessages(
        CASE_SERVICE_SUPERVISOR_INFO.userId,
        petitionsSectionMessage,
        'petitions',
      );

      cy.login('caseServicesSupervisor1', '/messages/my/inbox');

      assertMessageRecordCountForDocketNumberAndSubject(
        docketNumber,
        docketSectionMessage,
        1,
        'individual',
      );
      assertMessageRecordCountForDocketNumberAndSubject(
        docketNumber,
        petitionsSectionMessage,
        1,
        'individual',
      );

      cy.visit('/messages/section/inbox/selectedSection?section=docket');
      assertMessageRecordCountForDocketNumberAndSubject(
        docketNumber,
        docketSectionMessage,
        1,
        'section',
      );
      assertMessageRecordCountForDocketNumberAndSubject(
        docketNumber,
        petitionsSectionMessage,
        0,
        'section',
      );

      cy.visit('/messages/section/inbox/selectedSection?section=petitions');
      assertMessageRecordCountForDocketNumberAndSubject(
        docketNumber,
        docketSectionMessage,
        0,
        'section',
      );
      assertMessageRecordCountForDocketNumberAndSubject(
        docketNumber,
        petitionsSectionMessage,
        1,
        'section',
      );
    });
  });

  it('should have the served case document qc assigned and completed', () => {
    cy.login(
      'caseServicesSupervisor1',
      '/document-qc/section/inbox/selectedSection?section=docket',
    );
    cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      cy.get(`[data-testid="work-item-${docketNumber}"]`)
        .find('[data-testid="checkbox-assign-work-item"]')
        .click();

      cy.get('[data-testid="dropdown-select-assignee"]').select(
        DOCKET_CLERK_INFO.name,
      );

      cy.get(`[data-testid="work-item-${docketNumber}"]`)
        .find('[data-testid="table-column-work-item-assigned-to"]')
        .should('have.text', DOCKET_CLERK_INFO.name);

      cy.get(`[data-testid="work-item-${docketNumber}"]`)
        .find('.message-document-title')
        .find('a')
        .click();

      cy.get('#save-and-finish').click();

      cy.get('[data-testid="success-alert"]').should('contain', 'QC Completed');

      cy.visit('/document-qc/my/outbox');
      cy.get(`[data-testid="section-work-item-outbox-${docketNumber}"]`).should(
        'exist',
      );
    });
  });

  it('should have the unserved case in the petition qc assigned', () => {
    cy.login(
      'caseServicesSupervisor1',
      '/document-qc/section/inbox/selectedSection?section=petitions',
    );
    cy.get<string>('@UNSERVED_DOCKET_NUMBER').then(unservedDocketNumber => {
      cy.get(`[data-testid="work-item-${unservedDocketNumber}"]`).should(
        'exist',
      );

      cy.get(`[data-testid="work-item-${unservedDocketNumber}"]`)
        .find('[data-testid="checkbox-assign-work-item"]')
        .click();

      cy.get('[data-testid="dropdown-select-assignee"]').select(
        CASE_SERVICE_SUPERVISOR_INFO.name,
      );

      cy.visit('/document-qc/my/inbox');
      cy.get(
        `[data-testid="message-queue-docket-number-${unservedDocketNumber}"]`,
      ).should('be.visible');
    });
  });
});

function petitionerFilesADocument(docketNumber: string) {
  loginAsPetitioner();
  cy.get('[data-testid="docket-search-field"]').type(docketNumber);
  cy.get('[data-testid="search-by-docket-number"]').click();
  cy.get('[data-testid="button-file-document"]').click();
  cy.get('[data-testid="ready-to-file"]').click();
  cy.get('[data-testid="document-type"]').click();

  cy.get('[data-testid="document-type"]').click();
  cy.get('[data-testid="document-type"]').type('Exhibit(s)');
  cy.get('#react-select-2-option-0').click();
  cy.get('[data-testid="submit-document"]').click();
  attachDummyFile('primary-document');
  cy.get('#submit-document').click();
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="file-document-review-submit-document"]').click();
  cy.get('[data-testid="success-alert"]').should('exist');
}

function assertMessageRecordCountForDocketNumberAndSubject(
  docketNumber: string,
  subject: string,
  count: number,
  inboxType: string,
) {
  cy.get(`[data-testid="${inboxType}-message-inbox-docket-number-cell"]`).then(
    $elements => {
      const parentElements = $elements.map((index, element) =>
        Cypress.$(element).parent(),
      );

      const matchingParents = parentElements.filter((_, parentElement) => {
        const parentText = Cypress.$(parentElement).text();
        return (
          parentText.includes(docketNumber) && parentText.includes(subject)
        );
      });

      expect(matchingParents.length).to.be.equal(count);
    },
  );
}

function sendMessages(userId: string, subject: string, section: string) {
  cy.get('[data-testid="case-detail-menu-button"]').click();
  cy.get('[data-testid="menu-button-add-new-message"]').click();
  cy.get('[data-testid="message-to-section"').select(section);
  cy.get('[data-testid="message-to-user-id"]').select(userId);
  cy.get('[data-testid="message-subject"]').type(subject);
  cy.get('[data-testid="message-body"]').type('Message');
  cy.get('[data-testid="modal-confirm"]').click();
  cy.get('[data-testid="success-alert"]').should('exist');
}
