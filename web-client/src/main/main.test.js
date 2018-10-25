import { CerebralTest } from 'cerebral/test';
import assert from 'assert';
// import nock from 'nock';

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
});
