import { loginAsDocketClerk } from 'cypress/helpers/authentication/login-as-helpers';
import {
  getButton,
  getCaptionTextArea,
  getCaseDetailTab,
  getCaseTitleContaining,
  getEditCaseCaptionButton,
} from '../../../../support/pages/case-detail';

describe('Edit a case caption from case detail header', function () {
  it('should changes the title of the case', () => {
    loginAsDocketClerk();
    cy.visit('/case-detail/101-19');
    getCaseDetailTab('case-information').click();
    getEditCaseCaptionButton().click();
    getCaptionTextArea().clear().type('there is no cow level');
    getButton('Save').click();

    getCaseTitleContaining(
      'there is no cow level v. Commissioner of Internal Revenue, Respondent',
    ).should('exist');
  });
});
