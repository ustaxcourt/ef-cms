import { AuthenticationResult } from '../../support/login-types';

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');

export const login = (email: string, route = '/') => {
  return cy
    .task<AuthenticationResult>('getUserToken', {
      email,
      password: DEFAULT_ACCOUNT_PASS,
    })
    .then(result => {
      const token = result.AuthenticationResult.IdToken;
      cy.visit(`/log-in?token=${token}&path=${route}`);
    });
};
