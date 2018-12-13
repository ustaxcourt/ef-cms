import { CerebralTest } from 'cerebral/test';

import presenter from '../presenter';
import applicationContext from '../applicationContext';

presenter.providers.applicationContext = applicationContext;
presenter.providers.router = { route: () => {} };

const test = CerebralTest(presenter);

describe('Miscellaneous', () => {
  it('Handles routing', async () => {
    await test.runSequence('gotoStyleGuideSequence');
    expect(test.getState('currentPage')).toEqual('StyleGuide');
  });

  it('Handles routing to file petition', async () => {
    await test.runSequence('gotoFilePetitionSequence');
    expect(test.getState('currentPage')).toEqual('FilePetition');
  });

  it('Toggles USA Banner Content', async () => {
    await test.runSequence('toggleUsaBannerDetailsSequence');
    expect(test.getState('usaBanner.showDetails')).toEqual(true);
    await test.runSequence('toggleUsaBannerDetailsSequence');
    expect(test.getState('usaBanner.showDetails')).toEqual(false);
  });

  it('Toggles payment info content', async () => {
    await test.runSequence('togglePaymentDetailsSequence');
    expect(test.getState('paymentInfo.showDetails')).toEqual(true);
    await test.runSequence('togglePaymentDetailsSequence');
    expect(test.getState('paymentInfo.showDetails')).toEqual(false);
  });
});
