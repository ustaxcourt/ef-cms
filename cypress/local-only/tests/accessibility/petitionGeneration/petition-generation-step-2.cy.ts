import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { fillPetitionerInformation } from '../../integration/fileAPetitionUpdated/petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Petition generation - step 2', () => {
  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
    fillPetitionerInformation();
  });

  it('Auto generate Petition: should be free of a11y issues', () => {
    cy.get('[data-testid="add-another-reason-link-button"').click();
    cy.get('[data-testid="add-another-fact-link-button"').click();
    checkA11y();
  });

  it('Upload PDF Petition: should be free of a11y issues', () => {
    cy.get('[data-testid="upload-a-petition-label"').click();
    checkA11y();
  });
});
