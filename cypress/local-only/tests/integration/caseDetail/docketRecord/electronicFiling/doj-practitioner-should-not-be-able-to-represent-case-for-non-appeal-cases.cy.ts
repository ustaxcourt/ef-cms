import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { goToCase } from '../../../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsDojPractitioner,
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCaseWithDeceasedSpouse } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkAddsRespondentToCase } from '../../../../../../helpers/caseDetail/caseInformation/petitionsclerk-adds-respondent-to-case';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';
import { updateCaseStatus } from '../../../../../../helpers/caseDetail/caseInformation/update-case-status';

describe('DOJ Practitioners - Represent A Party', () => {
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

  it('should only display the "Represent A Party" button when the case is "On Appeal"', () => {
    const BAR_NUMBER = 'WN7777';
    const primaryFilerName = 'John';
    const secondaryFilerName = 'Sally';

    loginAsPetitioner();
    petitionerCreatesElectronicCaseWithDeceasedSpouse(
      primaryFilerName,
      secondaryFilerName,
    ).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      petitionsClerkAddsRespondentToCase(docketNumber, BAR_NUMBER);
      loginAsPrivatePractitioner();
      externalUserSearchesDocketNumber(docketNumber);
      cy.get('[data-testid="request-represent-a-party-button"]').click();
      selectTypeaheadInput('document-type', 'Entry of Appearance');
      cy.get(`[data-testid="filer-${primaryFilerName}, Petitioner"]`).click();
      cy.get(`[data-testid="filer-${secondaryFilerName}, Petitioner"]`).click();
      cy.get('[data-testid="auto-generation"]').should('exist');
      cy.get('[data-testid="request-access-submit-document"]').click();
      cy.get('[data-testid="entry-of-appearance-pdf-preview"]').should('exist');
      cy.get('[data-testid="submit-represent-a-party-button"]').click();
      cy.get('[data-testid="document-download-link-EA"]').should(
        'contain.text',
        `Entry of Appearance for Petrs. ${primaryFilerName} & ${secondaryFilerName}`,
      );
      loginAsDojPractitioner();
      externalUserSearchesDocketNumber(docketNumber);
      cy.get('[data-testid="request-represent-a-party-button"]').should(
        'not.exist',
      );
      loginAsDocketClerk1();
      goToCase(docketNumber);
      updateCaseStatus('On Appeal');
      loginAsDojPractitioner();
      externalUserSearchesDocketNumber(docketNumber);
      cy.get('[data-testid="request-represent-a-party-button"]').should(
        'exist',
      );
    });
  });
});
