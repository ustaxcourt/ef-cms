import { CerebralTest } from 'cerebral/test';
import assert from 'assert';

import mainModule from '../main';
import applicationContext from '../applicationContexts/dev';

mainModule.providers.applicationContext = applicationContext;
mainModule.providers.router = { route: () => {} };

const test = CerebralTest(mainModule);

describe('Miscellaneous', () => {
  it('Handles routing', async () => {
    await test.runSequence('gotoStyleGuide');
    assert.equal(test.getState('currentPage'), 'StyleGuide');
  });

  it('Handles routing to file petition', async () => {
    await test.runSequence('gotoFilePetition');
    assert.equal(test.getState('currentPage'), 'FilePetition');
  });

  it('Toggles USA Banner Content', async () => {
    await test.runSequence('toggleUsaBannerDetails');
    assert.equal(test.getState('usaBanner.showDetails'), true);
    await test.runSequence('toggleUsaBannerDetails');
    assert.equal(test.getState('usaBanner.showDetails'), false);
  });

  it('Toggles payment info content', async () => {
    await test.runSequence('togglePaymentDetails');
    assert.equal(test.getState('paymentInfo.showDetails'), true);
    await test.runSequence('togglePaymentDetails');
    assert.equal(test.getState('paymentInfo.showDetails'), false);
  });
});
