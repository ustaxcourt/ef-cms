import { attachDummyFile } from '../../helpers/attach-file';
import { externalUserSearchesDocketNumber } from '../../helpers/external-user-searches-docket-number';
import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../helpers/auth/login-as-helpers';
import {
  petitionerCreatesEletronicCase,
  petitionerCreatesEletronicCaseWithDeseasedSpouse,
} from '../../helpers/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../support/setup/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../helpers/select-typeahead-input';

describe('Private Practitioner requests access to case', () => {
  it('should NOT have access to auto generate entry of appearance if a party service preference is paper', () => {
    const primaryFilerName = 'John';
    const secondaryFilerName = 'Sally';

    loginAsPetitioner();
    petitionerCreatesEletronicCaseWithDeseasedSpouse({
      primaryFilerName,
      secondaryFilerName,
    }).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      loginAsPrivatePractitioner();

      externalUserSearchesDocketNumber(docketNumber);

      cy.get('[data-testid="button-request-access"]').click();

      selectTypeaheadInput('document-type', 'Entry of Appearance');

      cy.get('[data-testid="auto-generation"]').should('not.exist');

      cy.get(`[data-testid="filer-${primaryFilerName}, Petitioner"]`).click();
      cy.get(`[data-testid="filer-${secondaryFilerName}, Petitioner"]`).click();

      // upload doc
      attachDummyFile('request-access-primary-document');

      // Review Page
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('#redaction-acknowledgement').check();
      cy.get('#submit-document').click();
      cy.get('[data-testid="document-download-link-EA"]').should(
        'have.text',
        `Entry of Appearance for Petrs. ${primaryFilerName} & ${secondaryFilerName}`,
      );
    });
  });

  it.skip('should have access to auto generate entry of appearance if there are no parties with paper service preference', () => {
    loginAsPetitioner();
    petitionerCreatesEletronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      loginAsPrivatePractitioner();

      externalUserSearchesDocketNumber(docketNumber);

      cy.get('[data-testid="button-request-access"]').click();

      selectTypeaheadInput('document-type', 'Entry of Appearance');

      cy.get('[data-testid="auto-generation"]').should('exist');
    });
  });
});
