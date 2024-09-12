import {
  fillCaseProcedureInformation,
  fillGeneratePetitionFileInformation,
  fillIrsNoticeInformation,
  fillPetitionerInformation,
  fillStinInformation,
} from './petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  describe('File a petition', () => {
    const caseTypes = [
      'Deficiency',
      'CDP (Lien/Levy)',
      'Other',
      'Partnership (Section 6228)',
      'Disclosure2',
      'Passport',
      'Innocent Spouse',
      'Worker Classification',
      'Whistleblower',
      'Interest Abatement',
      'Disclosure1',
      'Partnership (BBA Section 1101)',
      'Partnership (Section 6226)',
    ];

    caseTypes.forEach(caseType => {
      it(`should file a petition for case type: ${caseType}`, () => {
        loginAsPetitioner();
        cy.visit('/file-a-petition/new');
        fillPetitionerInformation();
        fillGeneratePetitionFileInformation();
        fillIrsNoticeInformation(VALID_FILE, caseType);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.intercept('POST', '**/cases').as('postCase');

        cy.get('[data-testid="step-6-next-button"]').click();
        cy.wait('@postCase').then(({ response }) => {
          if (!response) throw Error('Did not find response');
          expect(response.body).to.have.property('docketNumber');
          const createdDocketNumber = response.body.docketNumber;
          cy.get('.usa-alert__heading').should(
            'contain.text',
            `Your case has been assigned docket number ${createdDocketNumber}`,
          );
        });
      });
    });
  });
});
