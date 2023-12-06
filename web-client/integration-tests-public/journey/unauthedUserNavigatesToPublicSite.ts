import { applicationContextPublic as applicationContext } from '../../src/applicationContextPublic';

export const unauthedUserNavigatesToPublicSite = cerebralTest => {
  return it('Should navigate to the public site without logging in', async () => {
    await cerebralTest.runSequence('navigateToPublicSiteSequence', {});
    expect(cerebralTest.currentRouteUrl).toEqual(
      applicationContext.getPublicSiteUrl(),
    );
  });
};
