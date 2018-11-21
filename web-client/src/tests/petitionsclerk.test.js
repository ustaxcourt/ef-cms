import { CerebralTest } from 'cerebral/test';
import assert from 'assert';

import mainModule from '../main';
import applicationContext from '../applicationContexts/dev';

mainModule.providers.applicationContext = applicationContext;
mainModule.providers.router = { route: () => {} };

const test = CerebralTest(mainModule);

test.setState('user', {
  firstName: 'Petitions',
  lastName: 'Clerk',
  role: 'petitionsclerk',
  token: 'petitionsclerk',
  userId: 'petitionsclerk',
});

describe('Dashboard', () => {
  it('View cases', async () => {
    await test.runSequence('gotoDashboard');
    assert.equal(test.getState('currentPage'), 'PetitionsWorkQueue');
    // assert.equal(test.getState('cases'), []);
  });
});
