import { OBJECTIONS_OPTIONS_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { contactPrimaryFromState, fakeFile } from '../helpers';

export const docketClerkAddsPaperFiledMultiDocketableDocketEntryAndServes = (
  cerebralTest,
  eventCode,
) => {
  const answerFilingOptions = [
    {
      key: 'dateReceivedMonth',
      value: 4,
    },
    {
      key: 'dateReceivedDay',
      value: 30,
    },
    {
      key: 'dateReceivedYear',
      value: 2001,
    },
    {
      key: 'primaryDocumentFile',
      value: fakeFile,
    },
    {
      key: 'primaryDocumentFileSize',
      value: 100,
    },
    {
      key: 'eventCode',
      value: eventCode,
    },
  ];
  //add check for modal with cons cases

  return it('docket clerk adds paper filed docket entry and serves', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    for (const option of answerFilingOptions) {
      await cerebralTest.runSequence(
        'updateDocketEntryFormValueSequence',
        option,
      );
    }

    // await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
    //   key: 'objections',
    //   value: OBJECTIONS_OPTIONS_MAP.NO,
    // });

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('submitPaperFilingSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('consolidatedCaseAllCheckbox')).toBe(true);

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'ConfirmInitiateServiceModal',
    );

    // expect(cerebralTest.getState('alertSuccess').message).toEqual(
    //   'Your entry has been added to the docket record.',
    // );

    // expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    // expect(cerebralTest.getState('form')).toEqual({});

    // cerebralTest.docketEntryId = cerebralTest
    //   .getState('caseDetail.docketEntries')
    //   .find(doc => doc.eventCode === eventCode).docketEntryId;
  });
};
