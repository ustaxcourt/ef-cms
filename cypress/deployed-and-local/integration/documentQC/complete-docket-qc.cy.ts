/* eslint-disable promise/no-nesting */
import { assertExists, retry } from '../../../helpers/retry';
import { attachSamplePdfFile } from '../../../helpers/file/upload-file';
import { goToCase } from '../../../helpers/caseDetail/go-to-case';
import {
  loginAsAdmissionsClerk,
  loginAsPetitioner,
} from '../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../helpers/documentQC/petitionsclerk-serves-petition';

describe('Document QC Complete', () => {
  const docketSectionMessage = 'To CSS under Docket Section';
  const petitionsSectionMessage = 'To CSS under Petitions Section';

  before(() => {
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
      goToCase(docketNumber);
      cy.task<{ userId: string; name: string; email: string; role: string }>(
        'getUserByEmail',
        'caseServicesSupervisor1@example.com',
      ).then(caseServiceSupervisorInfo => {
        sendMessages(
          caseServiceSupervisorInfo.userId,
          docketSectionMessage,
          'docket',
        );

        sendMessages(
          caseServiceSupervisorInfo.userId,
          petitionsSectionMessage,
          'petitions',
        );
      });

      retry(() => {
        cy.login('caseServicesSupervisor1', '/messages/my/inbox');
        cy.get('table.usa-table');
        return assertMessageRecordCountForDocketNumberAndSubjectEscapeHatch(
          docketNumber,
          docketSectionMessage,
          1,
          'individual',
        );
      });
      assertMessageRecordCountForDocketNumberAndSubject(
        docketNumber,
        petitionsSectionMessage,
        1,
        'individual',
      );

      cy.visit('/messages/section/inbox/selectedSection?section=docket');
      cy.get('table.usa-table');
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
      cy.get('table.usa-table');
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
      cy.task<{ userId: string; name: string; email: string; role: string }>(
        'getUserByEmail',
        'docketclerk1@example.com',
      ).then(docketClerkInfo => {
        cy.get('[data-testid="dropdown-select-assignee"]').select(
          docketClerkInfo.name,
        );

        retry(() => {
          cy.login(
            'caseServicesSupervisor1',
            '/document-qc/section/inbox/selectedSection?section=docket',
          );
          cy.get('table.usa-table');
          return cy.get('body').then(body => {
            const workItem = body.find(
              `[data-testid="work-item-${docketNumber}"]`,
            );
            const assigneeName = workItem.find(
              '[data-testid="table-column-work-item-assigned-to"]',
            );
            const text = assigneeName.text();
            return cy.wrap(text.includes(docketClerkInfo.name));
          });
        });

        cy.get(`[data-testid="work-item-${docketNumber}"]`)
          .find('.message-document-title')
          .find('a')
          .click();

        cy.get('#save-and-finish').click();

        cy.get('[data-testid="success-alert"]').should(
          'contain',
          'QC Completed',
        );

        cy.visit('/document-qc/my/outbox');
        cy.get(
          `[data-testid="section-work-item-outbox-${docketNumber}"]`,
        ).should('exist');
      });
    });
  });

  it('should have the unserved case in the petition qc assigned', () => {
    cy.get<string>('@UNSERVED_DOCKET_NUMBER').then(unservedDocketNumber => {
      retry(() => {
        cy.login(
          'caseServicesSupervisor1',
          '/document-qc/section/inbox/selectedSection?section=petitions',
        );
        cy.get('[data-testid="section-work-queue-inbox"]').should('be.visible');
        return assertExists(
          `[data-testid="work-item-${unservedDocketNumber}"]`,
        );
      });

      cy.get(`[data-testid="work-item-${unservedDocketNumber}"]`)
        .find('[data-testid="checkbox-assign-work-item"]')
        .click();

      cy.task<{ userId: string; name: string; email: string; role: string }>(
        'getUserByEmail',
        'caseServicesSupervisor1@example.com',
      ).then(caseServiceSupervisorInfo => {
        cy.get('[data-testid="dropdown-select-assignee"]').select(
          caseServiceSupervisorInfo.name,
        );
      });

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
  attachSamplePdfFile('primary-document');
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

function assertMessageRecordCountForDocketNumberAndSubjectEscapeHatch(
  docketNumber: string,
  subject: string,
  count: number,
  inboxType: string,
) {
  return cy.get('body').then(body => {
    const $elements = body.find(
      `[data-testid="${inboxType}-message-inbox-docket-number-cell"]`,
    );

    const parentElements = $elements.map((index, element) =>
      Cypress.$(element).parent(),
    );

    const matchingParents = parentElements.filter((_, parentElement) => {
      const parentText = Cypress.$(parentElement).text();
      return parentText.includes(docketNumber) && parentText.includes(subject);
    });

    return cy.wrap(matchingParents.length === count);
  });
}

function sendMessages(userId: string, subject: string, section: string) {
  cy.get('[data-testid="case-detail-menu-button"]').click();
  cy.get('[data-testid="menu-button-add-new-message"]').click();
  cy.get('[data-testid="message-to-section"').select(section);
  cy.get('[data-testid="message-to-user-id"]').select(userId);
  cy.get('[data-testid="message-subject"]').type(subject);
  cy.get('[data-testid="message-body"]').type('Message');
  cy.get('[data-testid="modal-confirm"]').click();
  cy.get('[data-testid="loading-overlay"]').should('not.exist');
  cy.get('[data-testid="success-alert"]').should('exist');
}
