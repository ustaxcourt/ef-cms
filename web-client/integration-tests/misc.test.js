import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../src/applicationContext';
import { presenter } from '../src/presenter/presenter';

presenter.providers.applicationContext = applicationContext;
presenter.providers.router = { route: () => {} };

const cerebralTest = CerebralTest(presenter);

describe('Miscellaneous', () => {
  it('Handles routing', async () => {
    await cerebralTest.runSequence('gotoStyleGuideSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('StyleGuide');
  });

  it('Toggles USA Banner Content', async () => {
    await cerebralTest.runSequence('toggleUsaBannerDetailsSequence');
    expect(cerebralTest.getState('header.showUsaBannerDetails')).toEqual(true);
    await cerebralTest.runSequence('toggleUsaBannerDetailsSequence');
    expect(cerebralTest.getState('header.showUsaBannerDetails')).toEqual(false);
  });

  it('Toggles Beta Bar Visibility', async () => {
    expect(cerebralTest.getState('header.showBetaBar')).toEqual(true);
    await cerebralTest.runSequence('toggleBetaBarSequence');
    expect(cerebralTest.getState('header.showBetaBar')).toEqual(false);
  });
});
