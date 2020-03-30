import { applicationContextPublic as applicationContext } from '../../src/applicationContextPublic';

export default test => {
  return it('Should navigate to the public site without logging in', async () => {
    await test.runSequence('navigateToPublicSiteSequence', {});
    expect(test.currentRouteUrl).toEqual(applicationContext.getPublicSiteUrl());
  });
};
