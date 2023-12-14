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
import { selectRedactionAcknowledgement } from '../../helpers/select-redaction-acknowledgement';
import { selectTypeaheadInput } from '../../helpers/select-typeahead-input';

describe('Private Practitioner requests access to case', () => {
  it('should NOT have access to auto generate entry of appearance if a party service preference is paper', () => {
    const primaryFilerName = 'John';
    const secondaryFilerName = 'Sally';

    loginAsPetitioner();
    petitionerCreatesEletronicCaseWithDeseasedSpouse(
      primaryFilerName,
      secondaryFilerName,
    ).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      loginAsPrivatePractitioner();

      externalUserSearchesDocketNumber(docketNumber);

      cy.get('[data-testid="button-request-access"]').click();

      selectTypeaheadInput('document-type', 'Entry of Appearance');

      cy.get(`[data-testid="filer-${primaryFilerName}, Petitioner"]`).click();
      cy.get(`[data-testid="filer-${secondaryFilerName}, Petitioner"]`).click();

      attachDummyFile('primary-document');
      cy.get('[data-testid="request-access-submit-document"]').click();
      cy.get('[data-testid="auto-generation"]').should('not.exist');

      selectRedactionAcknowledgement();
      cy.get('[data-testid="request-access-review-submit-document"]').click();

      cy.get('[data-testid="document-download-link-EA"]').should(
        'have.text',
        `Entry of Appearance for Petrs. ${primaryFilerName} & ${secondaryFilerName}`,
      );
    });
  });

  it('should have access to auto generate entry of appearance if there are no parties with paper service preference', () => {
    const primaryFilerName = 'John';

    loginAsPetitioner();
    petitionerCreatesEletronicCase(primaryFilerName).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      loginAsPrivatePractitioner();

      externalUserSearchesDocketNumber(docketNumber);

      cy.get('[data-testid="button-request-access"]').click();

      selectTypeaheadInput('document-type', 'Entry of Appearance');
      cy.get(`[data-testid="filer-${primaryFilerName}, Petitioner"]`).click();

      cy.get('[data-testid="auto-generation"]').should('exist');

      cy.get('[data-testid="request-access-submit-document"]').click();

      cy.get('[data-testid="entry-of-appearance-pdf-preview"]').should('exist');
      cy.get('[data-testid="request-access-review-submit-document"]').click();

      cy.get('[data-testid="document-download-link-EA"]').should(
        'have.text',
        `Entry of Appearance for Petr. ${primaryFilerName}`,
      );
    });
  });
});
