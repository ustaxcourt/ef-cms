import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../src/applicationContext';
import { presenter } from '../src/presenter/presenter-mock';
import { toggleBetaBarSequence } from '@web-client/presenter/sequences/toggleBetaBarSequence';
import { gotoStyleGuideSequence } from '@web-client/presenter/sequences/gotoStyleGuideSequence';
import { toggleUsaBannerDetailsSequence } from '@web-client/presenter/sequences/toggleUsaBannerDetailsSequence';

presenter.providers.applicationContext = applicationContext;
presenter.providers.router = { route: () => {} };
presenter.sequences = {
  toggleBetaBarSequence,
  gotoStyleGuideSequence,
  toggleUsaBannerDetailsSequence,
};

const cerebralTest = CerebralTest(presenter);

describe('Miscellaneous', () => {
  beforeAll(() => {
    jest
      .spyOn(applicationContext.getUseCases(), 'getAllFeatureFlagsInteractor')
      .mockResolvedValue({});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
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
