import { CerebralTest } from 'cerebral/test';
import assert from 'assert';

import presenter from '../presenter';
import applicationContext from '../applicationContexts/dev';

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
    assert.equal(test.getState('currentPage'), 'LogIn');
  });

  it('succeeds for Petitions clerk', async () => {
    await test.runSequence('gotoLogInSequence');
    assert.equal(test.getState('currentPage'), 'LogIn');
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: 'petitionsclerk',
    });
    assert.equal(test.getState('form.name'), 'petitionsclerk');
    await test.runSequence('submitLogInSequence');
    assert.equal(test.getState('user.userId'), 'petitionsclerk');
    assert.equal(test.getState('user.role'), 'petitionsclerk');
  });

  describe('for Taxpayer', () => {
    it('succeeds with normal log-in functionality', async () => {
      await test.runSequence('gotoLogInSequence');
      assert.equal(test.getState('currentPage'), 'LogIn');
      await test.runSequence('updateFormValueSequence', {
        key: 'name',
        value: 'taxpayer',
      });
      assert.equal(test.getState('form.name'), 'taxpayer');
      await test.runSequence('submitLogInSequence');
      assert.equal(test.getState('user.userId'), 'taxpayer');
      assert.equal(test.getState('user.role'), 'taxpayer');
    });

    it('succeeds with token and path in URL', async () => {
      const token = 'taxpayer';
      const path = '/case-detail/101-18';
      await test.runSequence('loginWithTokenSequence', { token, path });
      assert.equal(test.getState('path'), path);
      assert.equal(test.getState('currentPage'), 'LogIn');
      assert.equal(test.getState('form.name'), 'taxpayer');
      assert.equal(test.getState('user.userId'), 'taxpayer');
      assert.equal(test.getState('user.role'), 'taxpayer');
    });
  });

  it('fails with Bad actor', async () => {
    await test.runSequence('gotoLogInSequence');
    assert.equal(test.getState('currentPage'), 'LogIn');
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: 'Bad actor',
    });
    assert.equal(test.getState('form.name'), 'Bad actor');
    await test.runSequence('submitLogInSequence');
    assert.equal(test.getState('alertError.title'), 'User not found');
  });
});
