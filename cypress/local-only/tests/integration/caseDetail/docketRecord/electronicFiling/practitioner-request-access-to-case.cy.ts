import { addIntervenorAsPartyToCase } from '../../../../../../helpers/caseDetail/caseInformation/add-intervenor-to-case';
import { attachSamplePdfFile } from '../../../../../../helpers/file/upload-file';
import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { goToCase } from '../../../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../../../helpers/authentication/login-as-helpers';
import {
  petitionerCreatesElectronicCase,
  petitionerCreatesElectronicCaseWithSpouse,
} from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';

describe('Private Practitioner requests to represent a party to a case', () => {
  describe('Auto Generate Entry of Appearance', () => {
    it('should have access to auto generate entry of appearance if a party service preference is paper', () => {
      const primaryFilerName = 'John';
      const secondaryFilerName = 'Sally';

      loginAsPetitioner();
      petitionerCreatesElectronicCaseWithSpouse(
        primaryFilerName,
        secondaryFilerName,
      ).then(docketNumber => {
        petitionsClerkServesPetition(docketNumber);
        loginAsPrivatePractitioner();

        externalUserSearchesDocketNumber(docketNumber);

        cy.get('[data-testid="request-represent-a-party-button"]').click();

        selectTypeaheadInput(
          'case-association-document-type-search',
          'Entry of Appearance',
        );

        cy.get(`[data-testid="filer-${primaryFilerName}, Petitioner"]`).click();
        cy.get(
          `[data-testid="filer-${secondaryFilerName}, Petitioner"]`,
        ).click();

        cy.get('[data-testid="auto-generation"]').should('exist');
        cy.get('[data-testid="request-access-submit-document"]').click();

        cy.get('[data-testid="entry-of-appearance-pdf-preview"]').should(
          'exist',
        );
        cy.get('[data-testid="submit-represent-a-party-button"]').click();

        cy.get('[data-testid="document-download-link-EA"]').should(
          'contain.text',
          `Entry of Appearance for Petrs. ${primaryFilerName} & ${secondaryFilerName}`,
        );
      });
    });

    it('should have access to auto generate entry of appearance if there are no parties with paper service preference', () => {
      const primaryFilerName = 'John';

      loginAsPetitioner();
      petitionerCreatesElectronicCase(primaryFilerName).then(docketNumber => {
        petitionsClerkServesPetition(docketNumber);

        loginAsDocketClerk1();
        goToCase(docketNumber);
        addIntervenorAsPartyToCase();

        loginAsPrivatePractitioner();
        externalUserSearchesDocketNumber(docketNumber);
        cy.get('[data-testid="request-represent-a-party-button"]').click();
        selectTypeaheadInput(
          'case-association-document-type-search',
          'Entry of Appearance',
        );
        cy.get(`[data-testid="filer-${primaryFilerName}, Petitioner"]`).click();
        cy.get('[data-testid="auto-generation"]').should('exist');
        cy.get('[data-testid="request-access-submit-document"]').click();

        cy.get('[data-testid="entry-of-appearance-pdf-preview"]').should(
          'exist',
        );
        cy.get('[data-testid="submit-represent-a-party-button"]').click();

        cy.get('[data-testid="document-download-link-EA"]').should(
          'have.text',
          `Entry of Appearance for Petr. ${primaryFilerName}`,
        );
      });
    });
  });

  describe('Upload File Entry of Appearance', () => {
    it('should have access to auto generate entry of appearance if a party service preference is paper', () => {
      const primaryFilerName = 'John';
      const secondaryFilerName = 'Sally';

      loginAsPetitioner();
      petitionerCreatesElectronicCaseWithSpouse(
        primaryFilerName,
        secondaryFilerName,
      ).then(docketNumber => {
        petitionsClerkServesPetition(docketNumber);
        loginAsPrivatePractitioner();

        externalUserSearchesDocketNumber(docketNumber);

        cy.get('[data-testid="request-represent-a-party-button"]').click();

        selectTypeaheadInput(
          'case-association-document-type-search',
          'Entry of Appearance',
        );

        cy.get(`[data-testid="filer-${primaryFilerName}, Petitioner"]`).click();
        cy.get(
          `[data-testid="filer-${secondaryFilerName}, Petitioner"]`,
        ).click();

        cy.get('[data-testid="manual-generation-label"]').click();
        attachSamplePdfFile('primary-document');
        cy.get('[data-testid="request-access-submit-document"]').click();

        cy.get('[data-testid="redaction-acknowledgement-label"]').click();
        cy.get('[data-testid="submit-represent-a-party-button"]').click();

        cy.get('[data-testid="document-download-link-EA"]').should(
          'have.text',
          `Entry of Appearance for Petrs. ${primaryFilerName} & ${secondaryFilerName}`,
        );
      });
    });
  });
});
