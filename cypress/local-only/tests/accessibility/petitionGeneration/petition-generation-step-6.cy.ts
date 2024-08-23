import { checkA11y } from '../../../support/generalCommands/checkA11y';
import {
  fillCaseProcedureInformation,
  fillIrsNoticeInformation,
  fillPetitionFileInformation,
  fillPetitionerInformation,
  fillStinInformation,
} from '../../integration/fileAPetitionUpdated/petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Petition generation - step 6', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
    fillPetitionerInformation();
    fillPetitionFileInformation(VALID_FILE);
    fillIrsNoticeInformation(VALID_FILE);
    fillCaseProcedureInformation();
    fillStinInformation(VALID_FILE);
  });

  it('Review Page: should be free of a11y issues', () => {
    checkA11y();
  });
});
