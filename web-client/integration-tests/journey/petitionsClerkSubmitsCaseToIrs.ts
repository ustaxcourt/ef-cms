import { CASE_STATUS_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../shared/src/business/entities/cases/Case';
import { FORMATS } from '@shared/business/utilities/DateHandler';

export const petitionsClerkSubmitsCaseToIrs = cerebralTest => {
  return it('Petitions clerk submits case to IRS', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: false,
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'irsNoticeDate',
        toFormat: FORMATS.ISO,
        value: '12/24/2050',
      },
    );

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      irsNoticeDate: Case.VALIDATION_ERROR_MESSAGES.irsNoticeDate[0].message,
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'irsNoticeDate',
        toFormat: FORMATS.ISO,
        value: '12/24/2017',
      },
    );

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});
    await cerebralTest.runSequence('serveCaseToIrsSequence');

    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('caseDetail.irsNoticeDate')).toEqual(
      '2017-12-24T00:00:00.000-05:00',
    );
    expect(cerebralTest.getState('caseDetail.status')).toEqual(
      CASE_STATUS_TYPES.generalDocket,
    );

    const documents = cerebralTest.getState('caseDetail.docketEntries');
    for (const document of documents) {
      if (!document.isMinuteEntry && !document.isDraft) {
        expect(document.servedAt).toBeDefined();
      }
    }
  });
};
