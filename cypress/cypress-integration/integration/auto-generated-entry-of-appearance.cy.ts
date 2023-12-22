import { createAndServePaperPetition } from '../../helpers/petitionsclerk-creates-paper-case';
import { externalUserSearchesDocketNumber } from '../../helpers/external-user-searches-docket-number';
import {
  loginAsDocketClerk,
  loginAsPetitionsClerk,
  loginAsPrivatePractitioner,
} from '../../helpers/auth/login-as-helpers';
import { searchByDocketNumberInHeader } from '../../helpers/search-by-docket-number-in-header';
import { selectTypeaheadInput } from '../../helpers/select-typeahead-input';

describe('Practitioner auto generates entry of appearance', () => {
  it('should request access to a case and verify ability to auto generate document', () => {
    loginAsPetitionsClerk();
    createAndServePaperPetition().then(({ docketNumber, name }) => {
      loginAsPrivatePractitioner();
      externalUserSearchesDocketNumber(docketNumber);
      cy.get('[data-testid="button-request-access"]').click();
      selectTypeaheadInput('document-type', 'Entry of Appearance');
      cy.get('[data-testid="auto-generation"]').should('not.exist');

      loginAsDocketClerk();
      searchByDocketNumberInHeader(docketNumber);

      cy.get('[data-testid="tab-case-information"] > .button-text').click();
      cy.get('[data-testid="tab-parties"] > .button-text').click();
      cy.get('#practitioner-search-field').clear();
      cy.get('#practitioner-search-field').type('PT1234');
      cy.get('.usa-search__submit-text').click();
      cy.get(`[data-testid="representing-${name}"]`).click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="success-alert"]').should('exist');

      loginAsPrivatePractitioner();
      externalUserSearchesDocketNumber(docketNumber);
      cy.get('[data-testid="button-request-access"]').click();
      selectTypeaheadInput('document-type', 'Entry of Appearance');
      cy.get('[data-testid="auto-generation"]').should('exist');
    });
  });
});
