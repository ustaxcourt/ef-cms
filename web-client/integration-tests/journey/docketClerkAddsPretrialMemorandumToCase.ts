import { FORMATS } from '@shared/business/utilities/DateHandler';
import { OBJECTIONS_OPTIONS_MAP } from '../../../shared/src/business/entities/EntityConstants';
import {
  contactPrimaryFromState,
  fakeFile,
  waitForCondition,
} from '../helpers';

export const docketClerkAddsPretrialMemorandumToCase = (
  cerebralTest,
  { caseNumber, filedByPetitioner, filedByPractitioner },
) => {
  return it('Docket clerk adds pretrial memorandum to case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest[`docketNumber${caseNumber}`],
    });

    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest[`docketNumber${caseNumber}`],
    });

    const pretrialMemorandum = [
      {
        key: 'primaryDocumentFile',
        value: fakeFile,
      },
      {
        key: 'primaryDocumentFileSize',
        value: 100,
      },
      {
        key: 'partyIrsPractitioner',
        value: filedByPractitioner,
      },
      {
        key: 'objections',
        value: OBJECTIONS_OPTIONS_MAP.NO,
      },
      {
        key: 'eventCode',
        value: 'PMT',
      },
    ];

    for (const item of pretrialMemorandum) {
      await cerebralTest.runSequence(
        'updateDocketEntryFormValueSequence',
        item,
      );
    }

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'receivedAt',
        toFormat: FORMATS.ISO,
        value: '4/30/2001',
      },
    );

    const { contactId } = contactPrimaryFromState(cerebralTest);
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactId}`,
        value: filedByPetitioner,
      },
    );

    await cerebralTest.runSequence('submitPaperFilingSequence');

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to the docket record.',
    );
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('form')).toEqual({});

    cerebralTest.docketEntryId = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(doc => doc.eventCode === 'PMT').docketEntryId;
  });
};
