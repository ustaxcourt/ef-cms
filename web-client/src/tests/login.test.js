import { CerebralTest } from 'cerebral/test';
import assert from 'assert';

import mainModule from '../main';
import applicationContext from '../applicationContexts/dev';

mainModule.providers.applicationContext = applicationContext;
mainModule.providers.router = { route: () => {} };

const test = CerebralTest(mainModule);

describe('Log in', () => {
  it('Petitions clerk success', async () => {
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

  it('Taxpayer success', async () => {
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

  it('Failure', async () => {
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
