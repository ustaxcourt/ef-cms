import {
  enterCaseTitleOrPetitionerName,
  enterDocumentDocketNumber,
  enterDocumentKeywordForAdvancedSearch,
  enterPetitionerName,
  getCaseTitleOrPetitionerNameInput,
  getDocketNumberInput,
  getKeywordInput,
  getPetitionerNameInput,
} from '../../support/pages/public/advanced-search';

describe('Public user experiences seamless reload after deployment', function () {
  it('should reload the page after deploy', () => {
    cy.visit('/');
    cy.get('button#tab-case');

    cy.window().then(w => (w.beforeReload = true));
    cy.window().should('have.prop', 'beforeReload');

    cy.task('modifyDeployedDateTextFile', Date.now().toString());

    cy.window({
      timeout: 10000,
    }).should('not.have.prop', 'beforeReload');
  });

  it('should navigate to case tab and keep form details after deploy', () => {
    cy.visit('/');
    cy.get('button#tab-case').click();
    enterPetitionerName('Osborne');

    cy.window().then(w => (w.beforeReload = true));

    cy.window().should('have.prop', 'beforeReload');

    cy.task('modifyDeployedDateTextFile', Date.now().toString());

    cy.window({
      timeout: 10000,
    }).should('not.have.prop', 'beforeReload');

    getPetitionerNameInput().should('have.value', 'Osborne');
  });

  it('should navigate to order tab and keep form details after deploy', () => {
    cy.visit('/');
    cy.get('button#tab-order').click();
    enterDocumentDocketNumber('124-20L');
    enterCaseTitleOrPetitionerName('Osborne');
    enterDocumentKeywordForAdvancedSearch('abcd');

    cy.window().then(w => (w.beforeReload = true));

    cy.window().should('have.prop', 'beforeReload');

    cy.task('modifyDeployedDateTextFile', Date.now().toString());

    cy.window({
      timeout: 10000,
    }).should('not.have.prop', 'beforeReload');

    getDocketNumberInput().should('have.value', '124-20L');
    getCaseTitleOrPetitionerNameInput().should('have.value', 'Osborne');
    getKeywordInput().should('have.value', 'abcd');
  });

  it('should navigate to opinion tab and keep form details after deploy', () => {
    cy.visit('/');
    cy.get('button#tab-opinion').click();
    enterDocumentDocketNumber('124-20L');
    enterCaseTitleOrPetitionerName('Osborne');
    enterDocumentKeywordForAdvancedSearch('abcd');

    cy.window().then(w => (w.beforeReload = true));

    cy.window().should('have.prop', 'beforeReload');

    cy.task('modifyDeployedDateTextFile', Date.now().toString());

    cy.window({
      timeout: 10000,
    }).should('not.have.prop', 'beforeReload');

    getDocketNumberInput().should('have.value', '124-20L');
    getCaseTitleOrPetitionerNameInput().should('have.value', 'Osborne');
    getKeywordInput().should('have.value', 'abcd');
  });
});
