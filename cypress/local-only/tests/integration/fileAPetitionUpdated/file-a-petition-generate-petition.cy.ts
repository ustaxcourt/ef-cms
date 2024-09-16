import { attachFile } from '../../../../helpers/file/upload-file';
import {
  contactInfo,
  fillBusinessandOtherContact,
  fillCaseProcedureInformation,
  fillGeneratePetitionFileInformation,
  fillIrsNoticeInformation,
  fillMultipleIRSNotices,
  fillPetitionerInformation,
  fillPrimaryContact,
  fillSecondaryContact,
  fillStinInformation,
  secondaryContactInfo,
} from './petition-helper';
import { downloadAndParsePdf } from '../../../support/helpers';
import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  describe('Generate petition file', () => {
    it('should generate petition for filing type Myself', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerInformation();
      fillGeneratePetitionFileInformation();
      fillIrsNoticeInformation(VALID_FILE, 'Deficiency');
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();
      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find response');

        cy.get('[data-testid="case-link"]').click();
        downloadAndParsePdf('[data-testid="document-download-link-P"]').then(
          text => {
            expect(text).to.include(response.body.docketNumber);
            expect(text).to.include(
              'John Cruz Petitioner v. Commissioner of Internal Revenue Respondent',
            );
            expect(text).to.include(
              '1. Which IRS ACTION(S) do you dispute? Notice of Deficiency',
            );
            expect(text).to.include(
              '2. If applicable, provide the date(s) the IRS issued the NOTICE(S) for the above and the city and state of the IRS office(s) issuing the NOTICE(S): N/A - Jackson, NJ',
            );
            expect(text).to.include(
              '3. Provide the year(s) or period(s) for which the NOTICE(S) was/were issued: 2024',
            );
            expect(text).to.include(
              '4. Which case procedure and trial location are you requesting? Regular - Birmingham, Alabama',
            );

            expect(text).to.include(
              '5. Explain why you disagree with the IRS action(s) in this case (please add each reason separately): a. REASON 1',
            );

            expect(text).to.include(
              '6. State the facts upon which you rely (please add each fact separately): a. FACT 1',
            );

            expect(text).to.include(
              "Petitioner's contact information: John Cruz 123 Test Drive Boulder, CO 12345 Phone: Test Phone Service email: petitioner1@example.com",
            );
          },
        );
      });
    });

    it('should generate petition for case type Disclosure', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerInformation();
      fillGeneratePetitionFileInformation();
      fillIrsNoticeInformation(VALID_FILE, 'Disclosure2');
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();
      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find response');

        cy.get('[data-testid="case-link"]').click();
        downloadAndParsePdf('[data-testid="document-download-link-P"]').then(
          text => {
            expect(text).to.include(response.body.docketNumber);
            expect(text).to.include(
              'John Cruz Petitioner v. Commissioner of Internal Revenue Respondent',
            );
            expect(text).to.include(
              '1. Which IRS ACTION(S) do you dispute? Notice - We Are Going To Make Your Determination Letter Available for Public Inspection',
            );
          },
        );
      });
    });

    it('should generate petition when user has not received an IRS notice', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerInformation();
      fillGeneratePetitionFileInformation();
      fillIrsNoticeInformation(VALID_FILE, 'Deficiency', false);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();
      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find response');

        cy.get('[data-testid="case-link"]').click();
        downloadAndParsePdf('[data-testid="document-download-link-P"]').then(
          text => {
            expect(text).to.include(response.body.docketNumber);
            expect(text).to.include(
              'John Cruz Petitioner v. Commissioner of Internal Revenue Respondent',
            );
            expect(text).to.include(
              '1. Which IRS ACTION(S) do you dispute? Deficiency',
            );
            expect(text).to.include(
              '2. If applicable, provide the date(s) the IRS issued the NOTICE(S) for the above and the city and state of the IRS office(s) issuing the NOTICE(S): N/A',
            );
            expect(text).to.include(
              '3. Provide the year(s) or period(s) for which the NOTICE(S) was/were issued: N/A',
            );
          },
        );
      });
    });

    it('should generate petition when user received multiple IRS notices', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerInformation();
      fillGeneratePetitionFileInformation(true);
      fillMultipleIRSNotices(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();
      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find response');

        cy.get('[data-testid="case-link"]').click();
        downloadAndParsePdf('[data-testid="document-download-link-P"]').then(
          text => {
            expect(text).to.include(response.body.docketNumber);
            expect(text).to.include(
              'John Cruz Petitioner v. Commissioner of Internal Revenue Respondent',
            );
            expect(text).to.include(
              '2. If applicable, provide the date(s) the IRS issued the NOTICE(S) for the above and the city and state of the IRS office(s) issuing the NOTICE(S): 05/02/24 - Jackson, NJ 05/02/23 - New York, NY',
            );
            expect(text).to.include(
              '3. Provide the year(s) or period(s) for which the NOTICE(S) was/were issued: 2024 2023',
            );
          },
        );
      });
    });

    it('should generate petition when user enters multiple facts and reasons', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerInformation();
      fillGeneratePetitionFileInformation(true);
      fillIrsNoticeInformation(VALID_FILE, 'Deficiency', false);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();
      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find response');

        cy.get('[data-testid="case-link"]').click();
        downloadAndParsePdf('[data-testid="document-download-link-P"]').then(
          text => {
            expect(text).to.include(response.body.docketNumber);
            expect(text).to.include(
              'John Cruz Petitioner v. Commissioner of Internal Revenue Respondent',
            );
            expect(text).to.include(
              '5. Explain why you disagree with the IRS action(s) in this case (please add each reason separately): a. REASON 1 b. REASON 2',
            );

            expect(text).to.include(
              '6. State the facts upon which you rely (please add each fact separately): a. FACT 1 b. FACT 2',
            );
          },
        );
      });
    });

    it('should generate petition when filing for Myself and deceased Spouse', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');

      cy.get('[data-testid="filing-type-1"]').click();
      fillPrimaryContact();
      cy.get('[data-testid="is-spouse-deceased-0"]').click();
      cy.get('[data-testid="contact-secondary-name"]').type(
        secondaryContactInfo.name,
      );
      cy.get('[data-testid="contactSecondary-in-care-of"]').type(
        secondaryContactInfo.inCareOf,
      );
      fillSecondaryContact();
      cy.get('[data-testid="step-1-next-button"]').click();

      fillGeneratePetitionFileInformation();
      fillIrsNoticeInformation(VALID_FILE, 'Disclosure2');
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();
      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find response');

        cy.get('[data-testid="case-link"]').click();
        downloadAndParsePdf('[data-testid="document-download-link-P"]').then(
          text => {
            expect(text).to.include(response.body.docketNumber);
            expect(text).to.include(
              'John & Bill, Deceased Petitioners v. Commissioner of Internal Revenue Respondent',
            );
            expect(text).to.include(
              "Petitioner's contact information: John 111 South West St. Orlando, AK 33233 Phone: 3232323232 Place of legal residence: Delaware Service email: petitioner1@example.com",
            );
            expect(text).to.include(
              "Spouse's contact information: Bill c/o: Spouse Care of 111 South West St. Orlando, AK 33233 Phone: 7878787878 Email: petitioner2@example.com Register for electronic filing and service: Yes Place of legal residence: New Jersey",
            );
          },
        );
      });
    });

    it('should generate petition when filing for Myself and Spouse', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');

      cy.get('[data-testid="filing-type-1"]').click();
      fillPrimaryContact();
      cy.get('[data-testid="is-spouse-deceased-1"]').click();
      cy.get('[data-testid="have-spouse-consent-label"]').click();
      cy.get('[data-testid="contact-secondary-name"]').type(
        secondaryContactInfo.name,
      );
      fillSecondaryContact();

      cy.get('[data-testid="step-1-next-button"]').click();

      fillGeneratePetitionFileInformation();
      fillIrsNoticeInformation(VALID_FILE, 'Disclosure2');
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();
      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find response');

        cy.get('[data-testid="case-link"]').click();
        downloadAndParsePdf('[data-testid="document-download-link-P"]').then(
          text => {
            expect(text).to.include(response.body.docketNumber);
            expect(text).to.include(
              'John & Bill Petitioners v. Commissioner of Internal Revenue Respondent',
            );
            expect(text).to.include(
              "Petitioner's contact information: John 111 South West St. Orlando, AK 33233 Phone: 3232323232 Place of legal residence: Delaware Service email: petitioner1@example.com",
            );
            expect(text).to.include(
              "Spouse's contact information: Bill 111 South West St. Orlando, AK 33233 Phone: 7878787878 Email: petitioner2@example.com Register for electronic filing and service: Yes Place of legal residence: New Jersey",
            );
          },
        );
      });
    });

    it('should generate petition when filing for Business', () => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');

      cy.get('[data-testid="filing-type-2"]').click();
      cy.get('[data-testid="business-type-0"]').click();
      fillBusinessandOtherContact({
        fillInCareOf: true,
      });
      cy.get('[data-testid="contactPrimary-placeOfLegalResidence"]').select(
        contactInfo.placeOfLegalResidence,
      );
      cy.get('[data-testid="contact-primary-phone"]').type(contactInfo.phone);
      attachFile({
        filePath: VALID_FILE,
        selector: '[data-testid="corporate-disclosure-file"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('[data-testid="step-1-next-button"]').click();

      fillGeneratePetitionFileInformation();
      fillIrsNoticeInformation(VALID_FILE, 'Disclosure2');
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.intercept('POST', '**/cases').as('postCase');

      cy.get('[data-testid="step-6-next-button"]').click();
      cy.wait('@postCase').then(({ response }) => {
        if (!response) throw Error('Did not find response');

        cy.get('[data-testid="case-link"]').click();
        downloadAndParsePdf('[data-testid="document-download-link-P"]').then(
          text => {
            expect(text).to.include(response.body.docketNumber);
            expect(text).to.include(
              'Test name Petitioner v. Commissioner of Internal Revenue Respondent',
            );
            expect(text).to.include('Corporate Disclosure Statement');
            expect(text).to.include('Place of business: Delaware');
          },
        );
      });
    });

    it('should generate petition when filed by Practitioner', () => {
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
        if (!response) throw Error('Did not find response');

        cy.get('[data-testid="case-link"]').click();
        downloadAndParsePdf('[data-testid="document-download-link-P"]').then(
          text => {
            expect(text).to.include(response.body.docketNumber);
            expect(text).to.include(
              'John Cruz Petitioner v. Commissioner of Internal Revenue Respondent',
            );
            expect(text).to.include(
              "Petitioner's contact information: John Cruz 123 Test Drive Boulder, CO 12345 Phone: Test Phone",
            );
            expect(text).to.include(
              "Counsel's contact information: Test Private Practitioner Bogus Barristers 234 Main St Apartment 4 Under the stairs Chicago, IL 61234 Phone: +1 (555) 555-5555 Email: privatePractitioner1@example.com Tax Court Bar No.: PT5432",
            );
            expect(text).not.to.include('Service Email');
            expect(text).not.to.include(
              'Register for electronic filing and service',
            );
          },
        );
      });
    });
  });
});
