import { petitionsclerkCreatesAndServesPaperPetition } from '../../helpers/petitionsclerk-creates-and-serves-paper-petition';
import { retry } from '../../helpers/retry';

describe('search page functionality', () => {
  // it('should be able to create a case and serve to IRS', () => {
  //   petitionsclerkCreatesAndServesPaperPetition().then(docketNumber => {
  //     cy.getByTestId('search-link').click();
  //     cy.getByTestId('petitioner-name').clear();
  //     cy.getByTestId('petitioner-name').type('rick james');
  //     cy.getByTestId('case-search-by-name').click();
  //     cy.getByTestId(`case-result-${docketNumber}`).should('exist');
  //     cy.getByTestId('clear-search-by-name').click();
  //     cy.getByTestId(`case-result-${docketNumber}`).should('not.exist');
  //     cy.getByTestId('docket-number').clear();
  //     cy.getByTestId('docket-number').type(docketNumber);
  //     cy.getByTestId('docket-search-button').click();
  //     cy.url().should('include', `/case-detail/${docketNumber}`);
  //   });
  // });

  // it('should be able to search for practitioners by name', () => {
  //   cy.login('docketclerk1');
  //   cy.getByTestId('inbox-tab-content').should('exist');
  //   cy.getByTestId('search-link').click();
  //   cy.getByTestId('tab-practitioner').click();
  //   cy.getByTestId('practitioner-name').clear();
  //   cy.getByTestId('practitioner-name').type('test');
  //   cy.getByTestId('practitioner-search-by-name-button').click();
  //   cy.getByTestId('practitioner-row-PT1234').should('exist');
  //   cy.getByTestId('clear-practitioner-search').click();
  //   cy.getByTestId('practitioner-row-PT1234').should('not.exist');
  //   cy.getByTestId('bar-number').clear();
  //   cy.getByTestId('bar-number').type('pt1234');
  //   cy.getByTestId('practitioner-search-by-bar-number-button').click();
  //   cy.url().should('include', 'pt1234');
  // });

  // it('should be able to search for practitioners by bar number', () => {
  //   cy.login('docketclerk1');
  //   cy.getByTestId('inbox-tab-content').should('exist');
  //   cy.getByTestId('search-link').click();
  //   cy.getByTestId('tab-practitioner').click();
  //   cy.getByTestId('bar-number').clear();
  //   cy.getByTestId('bar-number').type('pt1234');
  //   cy.getByTestId('practitioner-search-by-bar-number-button').click();
  //   cy.url().should('include', 'pt1234');
  // });

  it('create an opinion on a case and search for it', () => {
    petitionsclerkCreatesAndServesPaperPetition().then(docketNumber => {
      cy.login('docketclerk1');
      cy.getByTestId('inbox-tab-content').should('exist');
      cy.visit(`/case-detail/${docketNumber}`);
      cy.getByTestId('case-detail-menu-button').click();
      cy.getByTestId('menu-button-upload-pdf').click();
      cy.getByTestId('upload-description').clear();
      cy.getByTestId('upload-description').type('an opinion');
      cy.getByTestId('primary-document-file').attachFile(
        '../fixtures/w3-dummy.pdf',
      );
      cy.get('[data-cy="upload-file-success"]').should('exist');
      cy.getByTestId('save-uploaded-pdf-button').click();
      cy.getByTestId('add-court-issued-docket-entry-button').click();
      cy.get('#react-select-2-input').clear();
      cy.get('#react-select-2-input').type('opinion');
      cy.get('#react-select-2-option-57').click();
      cy.getByTestId('judge-select').select('Ashford');
      cy.getByTestId('serve-to-parties-btn').click();
      cy.getByTestId('modal-button-confirm').click();
      cy.getByTestId('print-paper-service-done-button').click();
      cy.getByTestId('search-link').click();
      cy.getByTestId('tab-opinion').click();
      cy.getByTestId('keyword-search').clear();
      cy.getByTestId('keyword-search').type('an opinion');
      // need to wait for elasticsearch potentially
      retry(() => {
        cy.getByTestId('advanced-search-button').click();
        cy.get('.search-results').should('exist');
        return cy.get('body').then(body => {
          return (
            body.find(`[data-testid="docket-number-link-${docketNumber}"]`)
              .length > 0
          );
        });
      });
    });
  });
});
