import { CerebralTest } from 'cerebral/test';
import { ActionError } from '../src/presenter/errors/ActionError';

import presenter from '../src/presenter';
import applicationContext from '../src/applicationContext';

presenter.providers.applicationContext = applicationContext;
presenter.providers.router = {
  route: async url => {
    if (url === '/log-in') {
      await test.runSequence('gotoLogInSequence');
    }
  },
};
const test = CerebralTest(presenter);

describe('Log in', async () => {
  it('redirects to /log-in if not authorized', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('LogIn');
  });

  it('succeeds for Petitions clerk', async () => {
    await test.runSequence('gotoLogInSequence');
    expect(test.getState('currentPage')).toEqual('LogIn');
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: 'petitionsclerk',
    });
    expect(test.getState('form.name')).toEqual('petitionsclerk');
    await test.runSequence('submitLogInSequence');
    expect(test.getState('user.userId')).toEqual('petitionsclerk');
    expect(test.getState('user.role')).toEqual('petitionsclerk');
  });

  describe('for Taxpayer', () => {
    it('succeeds with normal log-in functionality', async () => {
      await test.runSequence('gotoLogInSequence');
      expect(test.getState('currentPage')).toEqual('LogIn');
      await test.runSequence('updateFormValueSequence', {
        key: 'name',
        value: 'taxpayer',
      });
      expect(test.getState('form.name')).toEqual('taxpayer');
      await test.runSequence('submitLogInSequence');
      expect(test.getState('user.userId')).toEqual('taxpayer');
      expect(test.getState('user.role')).toEqual('petitioner');
    });

    it('succeeds with token and path in URL', async () => {
      const token = 'taxpayer';
      const path = '/case-detail/101-18';
      await test.runSequence('loginWithTokenSequence', { token, path });
      expect(test.getState('path')).toEqual(path);
      expect(test.getState('currentPage')).toEqual('LogIn');
      expect(test.getState('form.name')).toEqual('taxpayer');
      expect(test.getState('user.userId')).toEqual('taxpayer');
      expect(test.getState('user.role')).toEqual('petitioner');
    });
  });

  it('fails with Bad actor', async () => {
    let result = '😡';
    await test.runSequence('gotoLogInSequence');
    expect(test.getState('currentPage')).toEqual('LogIn');
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: 'Bad actor',
    });
    expect(test.getState('form.name')).toEqual('Bad actor');
    try {
      await test.runSequence('submitLogInSequence');
    } catch (e) {
      if (e instanceof ActionError) {
        result = '😃';
      }
    }
    expect(result).toEqual('😃');
  });
});
