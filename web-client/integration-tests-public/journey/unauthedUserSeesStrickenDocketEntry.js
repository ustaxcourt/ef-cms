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
  test,
  docketRecordIndex,
) => {
  return it('View case detail', async () => {
    await test.runSequence('gotoPublicCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.currentRouteUrl.includes('/case-detail')).toBeTruthy();
    const contactPrimary = contactPrimaryFromState(test);
    expect(contactPrimary.name).toBeDefined();

    const { formattedDocketEntriesOnDocketRecord } = runCompute(
      publicCaseDetailHelper,
      {
        state: test.getState(),
      },
    );

    const formattedDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      docketEntry => docketEntry.index === docketRecordIndex,
    );
    test.docketEntryId = formattedDocketEntry.docketEntryId;

    expect(formattedDocketEntry.isStricken).toEqual(true);
    expect(formattedDocketEntry.showDocumentDescriptionWithoutLink).toEqual(
      true,
    );
  });
};
