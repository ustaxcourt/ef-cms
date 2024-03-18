import { loginHelper } from '@web-client/presenter/computeds/Login/loginHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('loginHelper', () => {
  describe('disableLoginButton', () => {
    it('should return false when email is not on the form', () => {
      const { disableLoginButton } = runCompute(loginHelper, {
        state: {
          authentication: {
            form: {
              code: '',
              confirmPassword: '',
              email: '',
              password: 'aA1!aaaa',
            },
            tempPassword: '',
          },
        },
      });

      expect(disableLoginButton).toEqual(true);
    });

    it('should return false when password is not on the form', () => {
      const { disableLoginButton } = runCompute(loginHelper, {
        state: {
          authentication: {
            form: {
              code: '',
              confirmPassword: '',
              email: 'realEmail@example.com',
              password: '',
            },
            tempPassword: '',
          },
        },
      });

      expect(disableLoginButton).toEqual(true);
    });

    it('should return true when both email and password are on the form', () => {
      const { disableLoginButton } = runCompute(loginHelper, {
        state: {
          authentication: {
            form: {
              code: '',
              confirmPassword: '',
              email: 'realEmail@example.com',
              password: 'friend',
            },
            tempPassword: '',
          },
        },
      });

      expect(disableLoginButton).toEqual(false);
    });
  });
});
