import { checkA11y } from '../../../support/generalCommands/checkA11y';
import {
  fillPetitionFileInformation,
  fillPetitionerInformation,
} from '../../integration/fileAPetitionUpdated/petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Petition generation - step 3', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
    fillPetitionerInformation();
    fillPetitionFileInformation(VALID_FILE);
  });

  it('IRS Notice Provided: should be free of a11y issues', () => {
    cy.get('[data-testid="irs-notice-Yes"]').click();
    checkA11y();
  });

  it('IRS Notice not Provided: should be free of a11y issues', () => {
    cy.get('[data-testid="irs-notice-No"]').click();
    checkA11y();
  });
});
