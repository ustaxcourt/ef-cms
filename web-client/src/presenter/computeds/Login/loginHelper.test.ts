import { loginHelper } from '@web-client/presenter/computeds/Login/loginHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('loginHelper', () => {
  describe('disableLoginButton', () => {
    it('should return false when email is not on the form', () => {
      const { disableLoginButton } = runCompute(loginHelper, {
        state: {
          authentication: {
            form: {
              password: 'aA1!aaaa',
            },
          },
        },
      });

      expect(disableLoginButton).toEqual(false);
    });

    it('should return false when password is not on the form', () => {
      const { disableLoginButton } = runCompute(loginHelper, {
        state: {
          authentication: {
            form: {
              email: 'realEmail@example.com',
            },
          },
        },
      });

      expect(disableLoginButton).toEqual(false);
    });

    it('should return true when both email and password are on the form', () => {
      const { disableLoginButton } = runCompute(loginHelper, {
        state: {
          authentication: {
            form: {
              email: 'realEmail@example.com',
              password: 'friend',
            },
          },
        },
      });

      expect(disableLoginButton).toEqual(true);
    });
  });
});
