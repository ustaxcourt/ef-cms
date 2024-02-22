import { externalUserSearchesDocketNumber } from '../../helpers/external-user-searches-docket-number';
import { loginAsPetitioner } from '../../helpers/auth/login-as-helpers';
import { petitionerCreatesEletronicCase } from '../../helpers/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../support/setup/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../helpers/select-typeahead-input';

describe(
  'Petitioner files external document on case',
  { scrollBehavior: 'center' },
  () => {
    it('should create an electronic petition, serve the petition, and files an "Answer" on the petition', () => {
      loginAsPetitioner();
      petitionerCreatesEletronicCase().then(docketNumber => {
        petitionsClerkServesPetition(docketNumber);
        loginAsPetitioner();
        externalUserSearchesDocketNumber(docketNumber);
      });
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput('document-type', 'Motion for Leave to File');
      cy.get(
        '[data-testid="secondary-doc-secondary-document-type"] .select-react-element__input',
      ).type('Answer{enter}');
      cy.get('[data-testid="submit-document"]').click();
      cy.get('[data-testid="primary-document"]').attachFile(
        '../fixtures/w3-dummy.pdf',
      );
      cy.get('[data-testid=primaryDocument-objections-No]').click();
      cy.get('#submit-document').click();
      cy.get('[data-testid=redaction-acknowledgement-label]').click();
      cy.get('#submit-document').click();
      cy.get('[data-testid="document-download-link-M115"]').should(
        'have.text',
        'Motion for Leave to File Answer (No Objection)',
      );
    });
  },
);
