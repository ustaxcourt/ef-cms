import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { fillPrimaryContact } from '../../integration/fileAPetitionUpdated/petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Petition generation - step 2', () => {
  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
    cy.get('[data-testid="filing-type-0"').click();
    fillPrimaryContact();
    cy.get('[data-testid="step-1-next-button"]').click();
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
