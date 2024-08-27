import { applicationContext } from '../../src/applicationContext';
import { first } from 'lodash';

export const petitionsClerkCreateOrder = cerebralTest => {
  return it('Petitions clerk creates order', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const beforeDocketEntriesCount = cerebralTest.getState(
      'caseDetail.docketEntries',
    ).length;

    await cerebralTest.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: 'O',
    });

    await cerebralTest.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'documentTitle',
      value: 'My Awesome Order',
    });

    await cerebralTest.runSequence('submitCreateOrderModalSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test order.</p>',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'documentContents',
      value: 'This is a test order.',
    });

    await cerebralTest.runSequence('submitCourtIssuedOrderSequence');

    //skip signing and go back to caseDetail
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('caseDetail.docketEntries').length).toEqual(
      beforeDocketEntriesCount + 1,
    );

    const { draftDocuments } = applicationContext
      .getUtilities()
      .getFormattedCaseDetail({
        applicationContext,
        authorizedUser: cerebralTest.getState('user'),
        caseDetail: cerebralTest.getState('caseDetail'),
      });

    cerebralTest.docketEntryId = first(draftDocuments)
      ? first(draftDocuments).docketEntryId
      : undefined;
    expect(cerebralTest.getState('draftDocumentViewerDocketEntryId')).toBe(
      cerebralTest.docketEntryId,
    );
  });
};
