import {
  contactPrimaryFromState,
  fakeFile,
  waitForCondition,
} from '../helpers';

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

  return it('Docket clerk adds paper filed multi-docketable document and serves', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.leadDocketNumber,
    });

    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.leadDocketNumber,
    });

    for (const option of answerFilingOptions) {
      await cerebralTest.runSequence(
        'updateDocketEntryFormValueSequence',
        option,
      );
    }

    const { contactId } = contactPrimaryFromState(cerebralTest);
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('openConfirmPaperServiceModalSequence');

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'ConfirmInitiatePaperFilingServiceModal',
    );
    expect(
      cerebralTest.getState('modal.form.consolidatedCaseAllCheckbox'),
    ).toBe(true);

    await cerebralTest.runSequence('submitPaperFilingSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    cerebralTest.multiDocketedDocketEntryId = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(doc => doc.eventCode === eventCode).docketEntryId;
  });
};
