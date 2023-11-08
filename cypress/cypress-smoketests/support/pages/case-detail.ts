import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { closeScannerSetupDialogIfExists } from './create-paper-case';
import { faker } from '@faker-js/faker';

faker.seed(faker.number.int());

const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
const DEPLOYING_COLOR = Cypress.env('DEPLOYING_COLOR');

export const goToCaseDetail = (docketNumber: string) => {
  cy.get('#search-field').clear();
  cy.get('#search-field').type(docketNumber);
  cy.get('.ustc-search-button').click();
  cy.get(`.big-blue-header h1 a:contains("${docketNumber}")`).should('exist');
};

export const goToCaseOverview = (docketNumber: string) => {
  // first visit / because if this step fails and has to be rerun, cerebral will
  // not see it as a new page visit when routing to the same route again and the page
  // will not reload
  cy.goToRoute('/');
  cy.get('.message-unread-column').should('exist');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.goToRoute(`/case-detail/${docketNumber}`);
  cy.get(`.big-blue-header h1 a:contains("${docketNumber}")`).should('exist');
  cy.get('#tab-case-information').click();
  cy.get('#tab-overview').click();
  cy.get('.internal-information').should('exist');
};

export const createOrder = (docketNumber: string) => {
  cy.goToRoute(
    `/case-detail/${docketNumber}/create-order?documentTitle=Order to Show Cause&documentType=Order to Show Cause&eventCode=OSC`,
  );
  cy.url().should('contain', '/create-order');
  cy.get('.ql-editor').type('A created order!');
  cy.get('#save-order-button').click();
  cy.url().should('contain', '/sign');
  cy.get('#skip-signature-button').click();
  cy.url().should('not.contain', '/sign');
};

export const editAndSignOrder = () => {
  cy.get('#draft-edit-button-not-signed').click();
  cy.url().should('contain', '/edit-order');
  cy.get('.ql-editor').type('edited');
  cy.get('#save-order-button').click();
  cy.url().should('contain', '/sign');
  cy.get('#sign-pdf-canvas').click();
  cy.get('#save-signature-button').click();
  cy.url().should('not.contain', '/sign');
};

export const addDocketEntryForOrderAndSaveForLater = (attempt: string) => {
  cy.get('#add-court-issued-docket-entry-button').click();
  cy.url().should('contain', '/add-court-issued-docket-entry');
  cy.get('#free-text').clear();
  cy.get('#free-text').type(` ${attempt}`);
  cy.get('#save-entry-button').click();
  cy.url().should('not.contain', '/add-court-issued-docket-entry');
  cy.get('button').contains(`Order to Show Cause ${attempt}`).click();
  cy.get('h3:contains("Order to Show Cause")').should('exist');
  cy.get('span:contains("Not served")').should('exist');
};

export const serveCourtIssuedDocketEntry = () => {
  cy.get('button:contains("Serve")').click();
  cy.get('.modal-button-confirm').click();
  cy.get('h3:contains("Order to Show Cause")').should('exist');
  cy.get('div:contains("Served")').should('exist');
};

export const addDocketEntryForOrderAndServePaper = () => {
  cy.get('#add-court-issued-docket-entry-button').click();
  cy.url().should('contain', '/add-court-issued-docket-entry');
  cy.get('#serve-to-parties-btn').click();
  cy.get('.modal-button-confirm').click();
  cy.get('.modal-dialog', { timeout: 60000 }).should('not.exist');
  cy.url().should('contain', '/print-paper-service');
  cy.get('#print-paper-service-done-button').click();
  cy.get('button:contains("Order to Show Cause")').click();
  cy.get('h3:contains("Order to Show Cause")').should('exist');
  cy.get('div:contains("Served")').should('exist');
};

export const addDocketEntryForUploadedPdfAndServe = () => {
  cy.get('#add-court-issued-docket-entry-button').click();
  cy.url().should('contain', '/add-court-issued-docket-entry');
  cy.get('div#document-type').type('Miscellaneous{enter}');
  cy.get('#serve-to-parties-btn').click();
  cy.get('.modal-button-confirm').click();
  cy.url().should('not.contain', '/add-court-issued-docket-entry');
  cy.get('button:contains("An Uploaded PDF")').click();
  cy.get('h3:contains("An Uploaded PDF")').should('exist');
  cy.get('div:contains("Served")').should('exist');
};

export const addDocketEntryForUploadedPdfAndServePaper = () => {
  cy.get('#add-court-issued-docket-entry-button').click();
  cy.url().should('contain', '/add-court-issued-docket-entry');
  cy.get('div#document-type').type('Miscellaneous{enter}');
  cy.get('#serve-to-parties-btn').click();
  cy.get('.modal-button-confirm').click();
  cy.get('.modal-dialog', { timeout: 60000 }).should('not.exist');
  cy.url().should('contain', '/print-paper-service');
  cy.get('#print-paper-service-done-button').click();
  cy.url().should('not.contain', '/print-paper-service');
  cy.get('button:contains("An Uploaded PDF")').click();
  cy.get('h3:contains("An Uploaded PDF")').should('exist');
  cy.get('div:contains("Served")').should('exist');
};

export const uploadCourtIssuedDocPdf = () => {
  cy.get('#case-detail-menu-button').click();
  cy.get('#menu-button-upload-pdf').click();
  cy.url().should('contain', '/upload-court-issued');
  cy.get('#upload-description').type('An Uploaded PDF');
  cy.get('input#primary-document-file').attachFile('../fixtures/w3-dummy.pdf');
  cy.get('[data-testid="upload-file-success"]');
};

export const reviewAndServePetition = () => {
  cy.get('#tab-document-view').click();
  cy.get('a:contains("Review and Serve Petition")').click();
  closeScannerSetupDialogIfExists();
  cy.get('button#tab-irs-notice').click();
  cy.get('label#has-irs-verified-notice-no').click();
  cy.get('button#submit-case').click();
  cy.get('button:contains("Serve to IRS")').click();
  cy.get('button#confirm:contains("Yes, Serve")').click();
  cy.get('.usa-alert:contains("Petition served")').should('exist');
};

export const clickSaveUploadedPdfButton = () => {
  cy.get('#save-uploaded-pdf-button').click();
  cy.get('h1:contains("Drafts")').should('exist');
  cy.get('h3:contains("An Uploaded PDF")').should('exist');
};

export const manuallyAddCaseToNewTrialSession = (trialSessionId: string) => {
  cy.get('#add-to-trial-session-btn').should('exist').click();
  cy.get('label[for="show-all-locations-true"]').click();
  cy.get('select#trial-session').select(trialSessionId);
  cy.get('select#trial-session').should('have.value', trialSessionId);
  cy.get('#modal-root .modal-button-confirm').click();
  cy.get('.usa-alert--success').should('contain', 'Case scheduled for trial.');
  cy.get('h3:contains("Trial - Scheduled")').should('exist');
};

export const manuallyAddCaseToCalendaredTrialSession = (
  trialSessionId: string,
) => {
  cy.get('#add-to-trial-session-btn').should('exist').click();
  cy.get('label[for="show-all-locations-true"]').click();
  cy.get('select#trial-session').select(trialSessionId);
  cy.get('select#trial-session').should('have.value', trialSessionId);
  cy.get('#modal-root .modal-button-confirm').click();
  cy.get('.usa-alert--success').should('contain', 'Case set for trial.');
};

export const removeCaseFromTrialSession = () => {
  cy.get('#edit-case-trial-information-btn').should('exist').click();
  cy.get('#remove-from-trial-session-btn').should('exist').click();
  cy.get('#disposition').type(faker.company.catchPhrase());
  cy.get('#modal-root .modal-button-confirm').click();
  cy.get('#add-to-trial-session-btn').should('exist');
  cy.get('.usa-alert--success').should('contain', 'Case removed from trial.');
};

export const blockCaseFromTrial = () => {
  cy.get('#tabContent-overview .block-from-trial-btn').click();
  cy.get('.modal-dialog #reason').type(faker.company.catchPhrase());
  cy.get('.modal-dialog .modal-button-confirm').click();
  cy.contains('Blocked From Trial').should('exist');
};

export const unblockCaseFromTrial = () => {
  cy.get('#remove-block').click();
  cy.get('.modal-button-confirm').click();
  cy.contains('Block removed.').should('exist');
};

export const setCaseAsHighPriority = () => {
  cy.get('.high-priority-btn').click();
  cy.get('#reason').type(faker.company.catchPhrase());
  cy.get('.modal-button-confirm').click();
  cy.get('.modal-dialog').should('not.exist');
  cy.contains('High Priority').should('exist');
};

export const setCaseAsReadyForTrial = () => {
  cy.get('#menu-edit-case-context-button').click();
  cy.get('#caseStatus').select(CASE_STATUS_TYPES.generalDocketReadyForTrial);
  cy.get('.modal-button-confirm').click();
  cy.get('.modal-dialog').should('not.exist');
  cy.contains(CASE_STATUS_TYPES.generalDocketReadyForTrial).should('exist');
};

export const viewPrintableDocketRecord = () => {
  cy.get('button#printable-docket-record-button').click();

  cy.get('a.modal-button-confirm')
    .invoke('attr', 'href')
    .then(href => {
      cy.request({
        followRedirect: true,
        hostname: `public-api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}`,
        method: 'GET',
        url: href,
      }).should(response => {
        expect(response.status).to.equal(200);
      });
    });
};

export const editPetitionerEmail = (emailAddress: string) => {
  cy.get('#tab-case-information').click();
  cy.get('#tab-parties').click();
  cy.get('.edit-petitioner-button').click();
  cy.get('#updatedEmail').type(emailAddress);
  cy.get('#confirm-email').type(emailAddress);
  cy.get('#submit-edit-petitioner-information').click();
  cy.get('#modal-button-confirm').click();
  cy.get('.modal-dialog', { timeout: 1000 }).should('not.exist');
  cy.get(`div.parties-card:contains(${emailAddress} (Pending))`).should(
    'exist',
  );
};

export const verifyEmailChange = () => {
  cy.get('tbody:contains(NOCE)').should('exist');
  cy.get('#tab-case-information').click();
  cy.get('#tab-parties').click();
  cy.get('div.parties-card:contains((Pending))').should('not.exist');
};
