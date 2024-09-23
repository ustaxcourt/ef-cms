import {
  fillCaseProcedureInformation,
  fillGeneratePetitionFileInformation,
  fillIrsNoticeInformation,
  fillPetitionFileInformation,
  fillPetitionerAndSpouseInformation,
  fillPetitionerInformation,
  fillStinInformation,
} from './petition-helper';
import {
  loginAsPetitioner,
  loginAsPetitionsClerk,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';

describe('File an Electronic Petition', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  describe('Petitioner generates a petition', () => {
    it('should allow Petitions Clerk to serve an electronic generated petition', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerInformation();
      fillGeneratePetitionFileInformation();
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();

      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find resposne');
        expect(response.body).to.have.property('docketNumber');
        const createdDocketNumber = response.body.docketNumber;

        loginAsPetitionsClerk();
        cy.get('[data-testid="docket-number-search-input"]').type(
          createdDocketNumber,
        );
        cy.get('[data-testid="search-docket-number"]').click();
        cy.get('[data-testid="document-viewer-link-P"]').click();
        cy.get('[data-testid="review-and-serve-petition"]').click();
        cy.get('[data-testid="tab-irs-notice"]').click();
        cy.get('[data-testid="has-irs-verified-notice-no"]').click();
        cy.get('[data-testid="submit-case"]').click();
        cy.get('[data-testid="serve-case-to-irs"]').click();
        cy.get('[data-testid="modal-confirm"]').click();
        cy.get('[data-testid="success-alert"]').contains(
          'Petition served to IRS.',
        );
      });
    });

    it('should allow Petitions Clerk to serve an electronic uploaded petition', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerInformation();
      fillPetitionFileInformation(VALID_FILE);
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();

      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find resposne');
        expect(response.body).to.have.property('docketNumber');
        const createdDocketNumber = response.body.docketNumber;

        loginAsPetitionsClerk();
        cy.get('[data-testid="docket-number-search-input"]').type(
          createdDocketNumber,
        );
        cy.get('[data-testid="search-docket-number"]').click();
        cy.get('[data-testid="document-viewer-link-P"]').click();
        cy.get('[data-testid="review-and-serve-petition"]').click();
        cy.get('[data-testid="tab-irs-notice"]').click();
        cy.get('[data-testid="has-irs-verified-notice-no"]').click();
        cy.get('[data-testid="submit-case"]').click();
        cy.get('[data-testid="serve-case-to-irs"]').click();
        cy.get('[data-testid="modal-confirm"]').click();
        cy.get('[data-testid="success-alert"]').contains(
          'Petition served to IRS.',
        );
      });
    });

    it('should allow Petitions Clerk to serve an electronic petition where secondary contact does not have a phone number filled out', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerAndSpouseInformation();
      fillPetitionFileInformation(VALID_FILE);
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();

      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find resposne');
        expect(response.body).to.have.property('docketNumber');
        const createdDocketNumber = response.body.docketNumber;

        loginAsPetitionsClerk();
        cy.get('[data-testid="docket-number-search-input"]').type(
          createdDocketNumber,
        );
        cy.get('[data-testid="search-docket-number"]').click();
        cy.get('[data-testid="document-viewer-link-P"]').click();
        cy.get('[data-testid="review-and-serve-petition"]').click();
        cy.get('[data-testid="tab-irs-notice"]').click();
        cy.get('[data-testid="has-irs-verified-notice-no"]').click();
        cy.get('[data-testid="submit-case"]').click();
        cy.get('[data-testid="serve-case-to-irs"]').click();
        cy.get('[data-testid="modal-confirm"]').click();
        cy.get('[data-testid="success-alert"]').contains(
          'Petition served to IRS.',
        );
      });
    });

    it('should allow Petitions Clerk to serve an electronic petition where secondary contact does have a phone number filled out', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerAndSpouseInformation(true);
      fillPetitionFileInformation(VALID_FILE);
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();

      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find resposne');
        expect(response.body).to.have.property('docketNumber');
        const createdDocketNumber = response.body.docketNumber;

        loginAsPetitionsClerk();
        cy.get('[data-testid="docket-number-search-input"]').type(
          createdDocketNumber,
        );
        cy.get('[data-testid="search-docket-number"]').click();
        cy.get('[data-testid="document-viewer-link-P"]').click();
        cy.get('[data-testid="review-and-serve-petition"]').click();
        cy.get('[data-testid="tab-irs-notice"]').click();
        cy.get('[data-testid="has-irs-verified-notice-no"]').click();
        cy.get('[data-testid="submit-case"]').click();
        cy.get('[data-testid="serve-case-to-irs"]').click();
        cy.get('[data-testid="modal-confirm"]').click();
        cy.get('[data-testid="success-alert"]').contains(
          'Petition served to IRS.',
        );
      });
    });
  });

  describe('Private practitioner generates a petition', () => {
    it('should allow Petitions Clerk to serve an electronic generated petition', () => {
      loginAsPrivatePractitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerInformation();
      fillGeneratePetitionFileInformation();
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();

      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find resposne');
        expect(response.body).to.have.property('docketNumber');
        const createdDocketNumber = response.body.docketNumber;

        loginAsPetitionsClerk();
        cy.get('[data-testid="docket-number-search-input"]').type(
          createdDocketNumber,
        );
        cy.get('[data-testid="search-docket-number"]').click();
        cy.get('[data-testid="document-viewer-link-P"]').click();
        cy.get('[data-testid="review-and-serve-petition"]').click();
        cy.get('[data-testid="tab-irs-notice"]').click();
        cy.get('[data-testid="has-irs-verified-notice-no"]').click();
        cy.get('[data-testid="submit-case"]').click();
        cy.get('[data-testid="serve-case-to-irs"]').click();
        cy.get('[data-testid="modal-confirm"]').click();
        cy.get('[data-testid="success-alert"]').contains(
          'Petition served to IRS.',
        );
      });
    });

    it('should allow Petitions Clerk to serve an electronic uploaded petition', () => {
      loginAsPrivatePractitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerInformation();
      fillPetitionFileInformation(VALID_FILE);
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();

      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find resposne');
        expect(response.body).to.have.property('docketNumber');
        const createdDocketNumber = response.body.docketNumber;

        loginAsPetitionsClerk();
        cy.get('[data-testid="docket-number-search-input"]').type(
          createdDocketNumber,
        );
        cy.get('[data-testid="search-docket-number"]').click();
        cy.get('[data-testid="document-viewer-link-P"]').click();
        cy.get('[data-testid="review-and-serve-petition"]').click();
        cy.get('[data-testid="tab-irs-notice"]').click();
        cy.get('[data-testid="has-irs-verified-notice-no"]').click();
        cy.get('[data-testid="submit-case"]').click();
        cy.get('[data-testid="serve-case-to-irs"]').click();
        cy.get('[data-testid="modal-confirm"]').click();
        cy.get('[data-testid="success-alert"]').contains(
          'Petition served to IRS.',
        );
      });
    });

    it('should allow Petitions Clerk to serve an electronic petition where secondary contact does not have a phone number filled out', () => {
      loginAsPrivatePractitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerAndSpouseInformation();
      fillPetitionFileInformation(VALID_FILE);
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();

      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find resposne');
        expect(response.body).to.have.property('docketNumber');
        const createdDocketNumber = response.body.docketNumber;

        loginAsPetitionsClerk();
        cy.get('[data-testid="docket-number-search-input"]').type(
          createdDocketNumber,
        );
        cy.get('[data-testid="search-docket-number"]').click();
        cy.get('[data-testid="document-viewer-link-P"]').click();
        cy.get('[data-testid="review-and-serve-petition"]').click();
        cy.get('[data-testid="tab-irs-notice"]').click();
        cy.get('[data-testid="has-irs-verified-notice-no"]').click();
        cy.get('[data-testid="submit-case"]').click();
        cy.get('[data-testid="serve-case-to-irs"]').click();
        cy.get('[data-testid="modal-confirm"]').click();
        cy.get('[data-testid="success-alert"]').contains(
          'Petition served to IRS.',
        );
      });
    });

    it('should allow Petitions Clerk to serve an electronic petition where secondary contact does have a phone number filled out', () => {
      loginAsPrivatePractitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerAndSpouseInformation(true);
      fillPetitionFileInformation(VALID_FILE);
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();

      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find resposne');
        expect(response.body).to.have.property('docketNumber');
        const createdDocketNumber = response.body.docketNumber;

        loginAsPetitionsClerk();
        cy.get('[data-testid="docket-number-search-input"]').type(
          createdDocketNumber,
        );
        cy.get('[data-testid="search-docket-number"]').click();
        cy.get('[data-testid="document-viewer-link-P"]').click();
        cy.get('[data-testid="review-and-serve-petition"]').click();
        cy.get('[data-testid="tab-irs-notice"]').click();
        cy.get('[data-testid="has-irs-verified-notice-no"]').click();
        cy.get('[data-testid="submit-case"]').click();
        cy.get('[data-testid="serve-case-to-irs"]').click();
        cy.get('[data-testid="modal-confirm"]').click();
        cy.get('[data-testid="success-alert"]').contains(
          'Petition served to IRS.',
        );
      });
    });
  });
});
