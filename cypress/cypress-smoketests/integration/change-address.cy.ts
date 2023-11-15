import { AuthenticationResult } from '../../support/login-types';
import { getEnvironmentSpecificFunctions } from '../support/environment-specific-factory';
import {
  goToEditContactInformation,
  goToMyAccount,
  saveContactInformation,
  updateAddress1,
} from '../support/pages/my-account';

const { login } = getEnvironmentSpecificFunctions();

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');

describe('Private practitioner', () => {
  let token: string;

  before(() => {
    cy.task<AuthenticationResult>('getUserToken', {
      email: 'privatePractitioner1@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      token = result.AuthenticationResult.IdToken;
    });
  });

  it('logs in', () => {
    login(token);
  });

  describe('changes their address', () => {
    it('can navigate to "My Account"', () => {
      goToMyAccount();
    });

    it('can navigate to "Edit Contact Information"', () => {
      goToEditContactInformation();
    });

    it(
      'can update and save their address',
      {
        defaultCommandTimeout: 90000,
      },
      () => {
        updateAddress1();
        saveContactInformation();
      },
    );
  });
});
