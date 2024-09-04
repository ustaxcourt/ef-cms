import { PROCEDURE_TYPES_MAP } from '../../../../../shared/src/business/entities/EntityConstants';
import { checkA11y } from '../../../support/generalCommands/checkA11y';
import {
  fillIrsNoticeInformation,
  fillPetitionFileInformation,
  fillPetitionerInformation,
} from '../../integration/fileAPetitionUpdated/petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Petition generation - step 4', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
    fillPetitionerInformation();
    fillPetitionFileInformation(VALID_FILE);
    fillIrsNoticeInformation(VALID_FILE);
  });

  it('Regular Case: should be free of a11y issues', () => {
    checkA11y();
  });

  it('Small Case: should be free of a11y issues', () => {
    cy.get(
      `[data-testid="procedure-type-${PROCEDURE_TYPES_MAP.small}-radio"]`,
    ).click();
    checkA11y();
  });
});
