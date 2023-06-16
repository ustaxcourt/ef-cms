import { applicationContextPublic } from '../../src/applicationContextPublic';
import { publicCaseDetailHelper as publicCaseDetailHelperComputed } from '../../src/presenter/computeds/Public/publicCaseDetailHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const unauthedUserViewsFilteredDocketRecord = cerebralTest => {
  const { PUBLIC_DOCKET_RECORD_FILTER_OPTIONS } =
    applicationContextPublic.getConstants();

  const publicCaseDetailHelper = withAppContextDecorator(
    publicCaseDetailHelperComputed,
    applicationContextPublic,
  );

  return it('Filters the docket record by Order type documents', async () => {
    await cerebralTest.runSequence('gotoPublicCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('sessionMetadata.docketRecordFilter')).toBe(
      PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.allDocuments,
    );

    const docketEntries = cerebralTest
      .getState('caseDetail.docketEntries')
      .filter(doc => !doc.isDraft);

    let { formattedDocketEntriesOnDocketRecord } = runCompute(
      publicCaseDetailHelper,
      {
        state: cerebralTest.getState(),
      },
    );

    expect(formattedDocketEntriesOnDocketRecord.length).toBe(
      docketEntries.length,
    );

    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'sessionMetadata.docketRecordFilter',
      value: PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.orders,
    });

    ({ formattedDocketEntriesOnDocketRecord } = runCompute(
      publicCaseDetailHelper,
      {
        state: cerebralTest.getState(),
      },
    ));

    expect(formattedDocketEntriesOnDocketRecord.length).toBe(1);
    expect(formattedDocketEntriesOnDocketRecord[0].eventCode).toBe('OD');

    await cerebralTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'sessionMetadata.docketRecordFilter',
      value: PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.motions,
    });

    ({ formattedDocketEntriesOnDocketRecord } = runCompute(
      publicCaseDetailHelper,
      {
        state: cerebralTest.getState(),
      },
    ));

    expect(formattedDocketEntriesOnDocketRecord.length).toBe(1);
    expect(formattedDocketEntriesOnDocketRecord[0].eventCode).toBe('M000');
  });
};
