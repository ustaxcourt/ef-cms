import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { searchByDocketNumberInHeader } from '../../helpers/search-by-docket-number-in-header';

describe('Document QC Complete', () => {
  // const seededDocketNumber = '105-20';
  const seedCaseServicesSupervisorUserid =
    '35959d1a-0981-40b2-a93d-f65c7977db52';
  const docketSectionMessage = 'To CSS under Docket Section';
  const petitionsSectionMessage = 'To CSS under Petitions Section';

  //beforeEach
  //createAndServePaperPetition().then
  //add file to qc
  //alias the docke number

  it('should test', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      console.log('docketNumber', docketNumber);
      //login as admissionsclerk@example.com
      cy.login('admissionsclerk');
      searchByDocketNumberInHeader(docketNumber);

      // create  a message to dockeet
      sendMessages(
        seedCaseServicesSupervisorUserid,
        docketSectionMessage,
        'docket',
      );

      //create a message to peetitions
      sendMessages(
        seedCaseServicesSupervisorUserid,
        petitionsSectionMessage,
        'petitions',
      );

      //login caseservicessupervisor@example.com
      //go to my inbox messages
      cy.login('caseservicessupervisor', '/messages/my/inbox');

      //assert both exist in message tabs
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

      //go to DOCKET_SECTION sectin inbox messages
      //docket message should be defined
      // petition should not
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

      //go to petition_SECTION sectin inbox messages
      //petition message should be defined
      // docket should not
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

      //click on Document QC > Docket Section QC
      cy.visit('/document-qc/section/inbox/selectedSection?section=docket');
      //assert seeded docket number is there
      //click on Document QC > petitions Section QC
      //assert seeded docket number is there
      //assign seeded case  to self from petitions QC
      //click on Document QC > My DocumentQC
      //assert seeded is there
      //assign seeded case  to docketclerk from docket QC
      //click on Document QC > Docket section qc
      //assert case is there
      //go to seeded qc
      //complete/
      //no errors
      //assert seedeed docket qc in outbox
    });
  });
});

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
