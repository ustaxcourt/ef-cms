import { applicationContextPublic } from '../../src/applicationContextPublic';
import { contactPrimaryFromState } from '../../integration-tests/helpers';
import { publicCaseDetailHelper as publicCaseDetailHelperComputed } from '../../src/presenter/computeds/public/publicCaseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const publicCaseDetailHelper = withAppContextDecorator(
  publicCaseDetailHelperComputed,
  applicationContextPublic,
);

export const unauthedUserSeesStrickenDocketEntry = (
  cerebralTest,
  docketRecordIndex,
) => {
  return it('View case detail', async () => {
    await cerebralTest.runSequence('gotoPublicCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.currentRouteUrl.includes('/case-detail')).toBeTruthy();
    const contactPrimary = contactPrimaryFromState(cerebralTest);
    expect(contactPrimary.name).toBeDefined();

    const { formattedDocketEntriesOnDocketRecord } = runCompute(
      publicCaseDetailHelper,
      {
        state: cerebralTest.getState(),
      },
    );

    const formattedDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      docketEntry => docketEntry.index === docketRecordIndex,
    );
    cerebralTest.docketEntryId = formattedDocketEntry.docketEntryId;

    expect(formattedDocketEntry.isStricken).toEqual(true);
    expect(formattedDocketEntry.showDocumentDescriptionWithoutLink).toEqual(
      true,
    );
  });
};
