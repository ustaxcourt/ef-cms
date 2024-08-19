import { checkA11y } from '../../../support/generalCommands/checkA11y';
import {
  fillCaseProcedureInformation,
  fillIrsNoticeInformation,
  fillPetitionFileInformation,
  fillPetitionerInformation,
  fillStinInformation,
} from '../../integration/fileAPetitionUpdated/petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Petition generation - step 7', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
    fillPetitionerInformation();
    fillPetitionFileInformation(VALID_FILE);
    fillIrsNoticeInformation(VALID_FILE);
    fillCaseProcedureInformation();
    fillStinInformation(VALID_FILE);
    cy.get('[data-testid="step-6-next-button"]').click();
  });

  it('Pay filing fee: should be free of a11y issues', () => {
    cy.intercept('POST', '**/cases').as('postCase');
    cy.wait('@postCase').then(() => {
      checkA11y();
    });
  });
});
