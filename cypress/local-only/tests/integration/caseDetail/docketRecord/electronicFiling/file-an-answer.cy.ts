import { attachFile } from '../../../../../../helpers/file/upload-file';
import { navigateTo as navigateToDashboard } from '../../../../../support/pages/dashboard';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';

describe('Filing an Answer', function () {
  it('should have a file first IRS document button', () => {
    cy.login('irspractitioner', '/case-detail/104-18');
    cy.get('#button-first-irs-document').click();
  });

  it('can select a document type and go to the next step in the wizard', () => {
    selectTypeaheadInput('complete-doc-document-type-search', 'Answer');
    cy.get('button#submit-document').click();
  });

  it('can upload the answer with indication of success', () => {
    cy.get('label#primary-document-label').scrollIntoView();
    cy.get('label#primary-document-label').should(
      'not.have.class',
      'validated',
    );
    attachFile({
      filePath: '../../helpers/file/sample.pdf',
      selector: '#primary-document',
      selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
    });
    cy.get('label#primary-document-label').should('have.class', 'validated');
  });

  it('can go to the review page without selecting party', () => {
    cy.get('button#submit-document').click();
  });

  it('can acknowledge redaction and submit the filing from the review page', () => {
    cy.get('label#redaction-acknowledgement-label').click();
    cy.get('button#submit-document').click();
    cy.showsSuccessMessage(true);
  });

  it('docket record table reflects newly-added record', () => {
    cy.get('table.ustc-table').find('button').should('contain', 'Answer');
  });

  it('reflects changes to 104-18 by showing it in irsPractitioner case list', () => {
    // wait for elasticsearch to refresh
    const SLEEP = 1000;
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(SLEEP);

    navigateToDashboard('irspractitioner');
    cy.get('table#case-list').find('a').should('contain', '104-18');
  });
});
