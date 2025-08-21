import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';
import { ACCOUNT_STATUS } from '@shared/business/entities/EntityConstants';

describe('docketclerk verifies inactive users do not show up in', () => {
  before(() => {
    cy.task('changeUserAccountStatus', {
      email: 'docketclerk1@example.com',
      accountStatus: ACCOUNT_STATUS.active,
    });
  });

  after(() => {
    cy.task('changeUserAccountStatus', {
      email: 'docketclerk1@example.com',
      accountStatus: ACCOUNT_STATUS.active,
    });
  });

  it('docketclerk loads up document qc, clicks a work item, clicks assign to, verifies a user shows up', () => {
    loginAsDocketClerk();
    cy.visit('/document-qc/section/inbox');
    cy.get('[data-testid="dropdown-select-assignee"]')
      .find(`option[value="2805d1ab-18d0-43ec-bafb-654e83405416"]`)
      .should('exist');

    cy.task('changeUserAccountStatus', {
      email: 'docketclerk1@example.com',
      accountStatus: ACCOUNT_STATUS.inactive,
    });

    cy.reload();
    cy.get('[data-testid="dropdown-select-assignee"]')
      .find(`option[value="2805d1ab-18d0-43ec-bafb-654e83405416"]`)
      .should('not.exist');
  });
});
