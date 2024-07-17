import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { loginAsPetitioner } from '../../../../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';

describe(
  'Petitioner files external document on case',
  { scrollBehavior: 'center' },
  () => {
    before(() => {
      cy.task('toggleFeatureFlag', {
        flag: 'updated-petition-flow',
        flagValue: false,
      });

      cy.reload(true);
    });

    after(() => {
      cy.task('toggleFeatureFlag', {
        flag: 'updated-petition-flow',
        flagValue: true,
      });
    });

    it('should create an electronic petition, serve the petition, and files an "Answer" on the petition', () => {
      loginAsPetitioner();
      petitionerCreatesElectronicCase().then(docketNumber => {
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
        '../../helpers/file/sample.pdf',
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
