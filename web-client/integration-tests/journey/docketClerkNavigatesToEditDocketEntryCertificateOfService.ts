import { FORMATS } from '@shared/business/utilities/DateHandler';

export const docketClerkNavigatesToEditDocketEntryCertificateOfService = (
  cerebralTest,
  docketRecordIndex = 2,
) => {
  it('the docketclerk navigates to page to edit docket entry meta for a minute entry', async () => {
    await cerebralTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
      docketRecordIndex,
    });

    expect(cerebralTest.getState('form.numberOfPages')).toEqual(2);
    expect(cerebralTest.getState('currentPage')).toEqual('EditDocketEntryMeta');
    expect(
      cerebralTest.getState('screenMetadata.documentTitlePreview'),
    ).toEqual('Certificate of Service of Petition 03-03-2003');
    expect(cerebralTest.getState('form.serviceDate')).toEqual(
      '2003-03-03T00:00:00.000-05:00',
    );

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'serviceDate',
        toFormat: FORMATS.ISO,
        value: '05/10/2005',
      },
    );

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'date-of-service-date-picker',
        value: '05/10/2005',
      },
    );

    expect(
      cerebralTest.getState('screenMetadata.documentTitlePreview'),
    ).toEqual('Certificate of Service of Petition 05-10-2005');
    expect(cerebralTest.getState('form.serviceDate')).toEqual(
      '2005-05-10T00:00:00.000-04:00',
    );

    await cerebralTest.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });

    await cerebralTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
      docketRecordIndex,
    });

    expect(cerebralTest.getState('form.numberOfPages')).toEqual(3);

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'filingDate',
        toFormat: FORMATS.ISO,
        value: '07/13/2002',
      },
    );

    await cerebralTest.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });

    await cerebralTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
      docketRecordIndex,
    });

    expect(cerebralTest.getState('form.numberOfPages')).toEqual(4);

    await cerebralTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'eventCode',
        value: 'BND',
      },
    );

    await cerebralTest.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });

    await cerebralTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
      docketRecordIndex,
    });

    expect(cerebralTest.getState('form.numberOfPages')).toEqual(5);
  });
};
