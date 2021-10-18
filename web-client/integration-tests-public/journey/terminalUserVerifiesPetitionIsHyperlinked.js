import { applicationContextPublic } from '../../src/applicationContextPublic';
import { publicCaseDetailHelper as publicCaseDetailHelperComputed } from '../../src/presenter/computeds/Public/publicCaseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const terminalUserVerifiesPetitionIsHyperlinked = cerebralTest => {
  const publicCaseDetailHelper = withAppContextDecorator(
    publicCaseDetailHelperComputed,
    applicationContextPublic,
  );

  return it('View case detail', async () => {
    await cerebralTest.runSequence('gotoPublicCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.currentRouteUrl.includes('/case-detail')).toBeTruthy();

    const helper = runCompute(publicCaseDetailHelper, {
      state: cerebralTest.getState(),
    });

    expect(
      helper.formattedDocketEntriesOnDocketRecord.find(
        docketRecord => docketRecord.descriptionDisplay === 'Petition',
      ),
    ).toMatchObject({
      showLinkToDocument: true,
    });
  });
};
