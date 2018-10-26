import { CerebralTest } from 'cerebral/test';
import assert from 'assert';

import mainModule from './';
import environment from '../environments/dev';

mainModule.providers.environment = environment;
const test = CerebralTest(mainModule);

describe('Main cerebral module', () => {
  it('Handles routing', async () => {
    await test.runSequence('gotoStyleGuide');
    assert.equal(test.getState('currentPage'), 'StyleGuide');
    await test.runSequence('gotoHome');
    assert.equal(test.getState('currentPage'), 'Home');
  });

  it('Toggles USA Banner Content', async () => {
    await test.runSequence('toggleUsaBannerDetails');
    assert.equal(test.getState('usaBanner.showDetails'), true);
    await test.runSequence('toggleUsaBannerDetails');
    assert.equal(test.getState('usaBanner.showDetails'), false);
  });

  it('uploads three petition documents successfully', async () => {
    nock(environment.getBaseUrl())
      .get('/documents/policy')
      .reply(200, {
        fields: {
          Policy: 'fakePolicyString',
        },
      });
    await test.runSequence('submitFilePetition');
    assert.equal(test.getState('petition.policy'), 'fakePolicyString');
  });

  it('handles document policy error', async () => {
    nock(environment.getBaseUrl())
      .get('/documents/policy')
      .reply(500, {
        fields: {},
      });
    await test.runSequence('submitFilePetition');
    assert.equal(
      test.getState('alertError'),
      'Document policy retrieval failed',
    );
  });
});
