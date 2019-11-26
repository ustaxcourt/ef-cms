import { applicationContextPublic as applicationContext } from '../src/applicationContextPublic';
import { setupTest } from './helpers';

const test = setupTest();

describe('Unauthed user navigates to public site', () => {
  it('Navigates to the public site', async () => {
    await test.runSequence('navigateToPublicSiteSequence', {});
    expect(test.currentRouteUrl).toEqual(applicationContext.getPublicSiteUrl());
  });
});
