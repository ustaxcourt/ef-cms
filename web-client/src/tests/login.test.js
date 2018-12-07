import { CerebralTest } from 'cerebral/test';
import assert from 'assert';

import mainModule from '../main';
import applicationContext from '../applicationContexts/dev';

mainModule.providers.applicationContext = applicationContext;
mainModule.providers.router = { route: () => {} };

const test = CerebralTest(mainModule);

describe('Log in', async () => {
  it('redirects to /log-in if not authorized', async () => {
    await test.runSequence('gotoDashboard');
    assert.equal(test.getState('currentPage'), 'LogIn');
    assert.equal(test.getState('path'), '/');
  });

  it('succeeds for Petitions clerk', async () => {
    await test.runSequence('gotoLogIn');
    assert.equal(test.getState('currentPage'), 'LogIn');
    await test.runSequence('updateFormValue', {
      key: 'name',
      value: 'petitionsclerk',
    });
    assert.equal(test.getState('form.name'), 'petitionsclerk');
    await test.runSequence('submitLogIn');
    assert.equal(test.getState('user.userId'), 'petitionsclerk');
    assert.equal(test.getState('user.role'), 'petitionsclerk');
  });

  describe('for Taxpayer', () => {
    it('succeeds with normal log-in functionality', async () => {
      await test.runSequence('gotoLogIn');
      assert.equal(test.getState('currentPage'), 'LogIn');
      await test.runSequence('updateFormValue', {
        key: 'name',
        value: 'taxpayer',
      });
      assert.equal(test.getState('form.name'), 'taxpayer');
      await test.runSequence('submitLogIn');
      assert.equal(test.getState('user.userId'), 'taxpayer');
      assert.equal(test.getState('user.role'), 'taxpayer');
    });

    it('succeeds with token and path in URL', async () => {
      const token = 'taxpayer';
      const path = '/case-detail/00101-18';
      await test.runSequence('loginWithToken', { token, path });
      assert.equal(test.getState('path'), path);
      assert.equal(test.getState('currentPage'), 'LogIn');
      assert.equal(test.getState('form.name'), 'taxpayer');
      assert.equal(test.getState('user.userId'), 'taxpayer');
      assert.equal(test.getState('user.role'), 'taxpayer');
    });
  });

  it('fails with Bad actor', async () => {
    await test.runSequence('gotoLogIn');
    assert.equal(test.getState('currentPage'), 'LogIn');
    await test.runSequence('updateFormValue', {
      key: 'name',
      value: 'Bad actor',
    });
    assert.equal(test.getState('form.name'), 'Bad actor');
    await test.runSequence('submitLogIn');
    assert.equal(test.getState('alertError.title'), 'User not found');
  });
});
